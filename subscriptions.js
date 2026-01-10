// subscriptions.js - Backend API for Dodo Payments Subscriptions
const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const DodoPayments = require('dodopayments');
const router = express.Router();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

// Webhook signing secret
const WEBHOOK_SECRET = process.env.DODO_WEBHOOK_SECRET || 'whsec_38vgvLI0zpBzd5ztTo8B25ScgAO4LGXh';

// Initialize Dodo Payments Client
const dodoClient = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.NODE_ENV === 'production' ? 'live_mode' : 'test_mode',
});

// MongoDB Schema for Subscriptions
const subscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  email: { type: String, required: true },
  name: { type: String },
  
  // Dodo Payments fields
  dodoSubscriptionId: { type: String, index: true },
  dodoCustomerId: { type: String },
  dodoProductId: { type: String },
  
  // Plan info
  planId: { 
    type: String, 
    enum: ['free', 'monthly', 'yearly'],
    default: 'free' 
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'on_hold', 'cancelled', 'expired', 'trial', 'none'],
    default: 'none',
  },
  
  // Dates
  currentPeriodStart: { type: Number },
  currentPeriodEnd: { type: Number },
  trialEnd: { type: Number },
  cancelledAt: { type: Number },
  cancelAtPeriodEnd: { type: Boolean, default: false },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

subscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Product ID mapping
const PRODUCT_IDS = {
  monthly: process.env.DODO_PRODUCT_MONTHLY,
  yearly: process.env.DODO_PRODUCT_YEARLY,
};

const PLAN_FROM_PRODUCT = Object.fromEntries(
  Object.entries(PRODUCT_IDS).map(([plan, productId]) => [productId, plan])
);

// ==================== API ENDPOINTS ====================

// GET /subscriptions/products - Get available products
router.get('/products', (req, res) => {
  res.json({
    success: true,
    products: {
      monthly: {
        id: PRODUCT_IDS.monthly,
        name: 'Monthly Premium',
        interval: 'month',
      },
      yearly: {
        id: PRODUCT_IDS.yearly,
        name: 'Yearly Premium',
        interval: 'year',
      },
    },
  });
});

// POST /subscriptions/checkout - Create checkout session
router.post('/checkout', async (req, res) => {
  try {
    const { productId, userId, email, name, trialDays = 3, returnUrl, cancelUrl } = req.body;

    if (!productId || !userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: productId, userId, email',
      });
    }

    // Create Dodo checkout session
    const session = await dodoClient.checkoutSessions.create({
      product_cart: [
        { product_id: productId, quantity: 1 }
      ],
      subscription_data: { 
        trial_period_days: trialDays 
      },
      customer: {
        email,
        name: name || 'LoneScore User',
      },
      metadata: {
        userId,
        source: 'lonescore_app',
      },
      return_url: returnUrl || `${process.env.FRONTEND_URL}/premium/success`,
    });

    // Store pending subscription
    await Subscription.findOneAndUpdate(
      { userId },
      {
        userId,
        email,
        name,
        dodoProductId: productId,
        planId: PLAN_FROM_PRODUCT[productId] || 'monthly',
        status: 'none',
        updatedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    console.log(`[Subscriptions] Checkout session created for user ${userId}: ${session.session_id}`);

    res.status(200).json({
      success: true,
      session_id: session.session_id,
      checkout_url: session.checkout_url,
    });
  } catch (error) {
    console.error('[Subscriptions] Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create checkout session',
    });
  }
});

// GET /subscriptions/status/:userId - Get subscription status
router.get('/status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne({ userId }).lean();

    if (!subscription || subscription.status === 'none') {
      return res.status(200).json({
        success: true,
        subscription_id: null,
        status: 'none',
        plan_id: 'free',
        current_period_start: null,
        current_period_end: null,
        trial_end: null,
        cancel_at_period_end: false,
      });
    }

    // Check if subscription has expired
    if (subscription.currentPeriodEnd && subscription.currentPeriodEnd < Date.now()) {
      await Subscription.updateOne(
        { userId },
        { status: 'expired', updatedAt: new Date() }
      );
      subscription.status = 'expired';
    }

    res.status(200).json({
      success: true,
      subscription_id: subscription.dodoSubscriptionId,
      status: subscription.status,
      plan_id: subscription.planId,
      current_period_start: subscription.currentPeriodStart,
      current_period_end: subscription.currentPeriodEnd,
      trial_end: subscription.trialEnd,
      cancel_at_period_end: subscription.cancelAtPeriodEnd,
    });
  } catch (error) {
    console.error('[Subscriptions] Error fetching subscription status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription status',
    });
  }
});

// POST /subscriptions/cancel - Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const { userId, subscriptionId } = req.body;

    if (!userId || !subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, subscriptionId',
      });
    }

    // Cancel in Dodo Payments (cancel at period end)
    await dodoClient.subscriptions.update(subscriptionId, {
      status: 'cancelled',
    });

    // Update local database
    await Subscription.updateOne(
      { userId, dodoSubscriptionId: subscriptionId },
      {
        cancelAtPeriodEnd: true,
        cancelledAt: Date.now(),
        updatedAt: new Date(),
      }
    );

    console.log(`[Subscriptions] Subscription cancelled for user ${userId}: ${subscriptionId}`);

    res.status(200).json({
      success: true,
      message: 'Subscription will be cancelled at the end of the billing period',
    });
  } catch (error) {
    console.error('[Subscriptions] Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel subscription',
    });
  }
});

// POST /subscriptions/reactivate - Reactivate on_hold subscription
router.post('/reactivate', async (req, res) => {
  try {
    const { userId, subscriptionId, returnUrl } = req.body;

    if (!userId || !subscriptionId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, subscriptionId',
      });
    }

    // Update payment method in Dodo
    const response = await dodoClient.subscriptions.updatePaymentMethod(subscriptionId, {
      type: 'new',
      return_url: returnUrl || `${process.env.FRONTEND_URL}/premium/success`,
    });

    console.log(`[Subscriptions] Reactivation initiated for user ${userId}: ${subscriptionId}`);

    res.status(200).json({
      success: true,
      payment_link: response.payment_link,
      payment_id: response.payment_id,
    });
  } catch (error) {
    console.error('[Subscriptions] Error reactivating subscription:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reactivate subscription',
    });
  }
});

// POST /subscriptions/change-plan - Change subscription plan
router.post('/change-plan', async (req, res) => {
  try {
    const { userId, subscriptionId, newProductId, proration = 'prorated_immediately' } = req.body;

    if (!userId || !subscriptionId || !newProductId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, subscriptionId, newProductId',
      });
    }

    // Change plan in Dodo
    await dodoClient.subscriptions.changePlan(subscriptionId, {
      product_id: newProductId,
      proration,
    });

    // Update local database
    await Subscription.updateOne(
      { userId, dodoSubscriptionId: subscriptionId },
      {
        dodoProductId: newProductId,
        planId: PLAN_FROM_PRODUCT[newProductId] || 'monthly',
        updatedAt: new Date(),
      }
    );

    console.log(`[Subscriptions] Plan changed for user ${userId}: ${subscriptionId} -> ${newProductId}`);

    res.status(200).json({
      success: true,
      message: 'Plan changed successfully',
    });
  } catch (error) {
    console.error('[Subscriptions] Error changing plan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change plan',
    });
  }
});

// GET /subscriptions/check-premium/:userId - Quick premium check (lightweight)
router.get('/check-premium/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const subscription = await Subscription.findOne(
      { userId },
      { status: 1, planId: 1, currentPeriodEnd: 1, trialEnd: 1 }
    ).lean();

    if (!subscription) {
      return res.json({ isPremium: false, plan: 'free' });
    }

    const isActive = subscription.status === 'active' || subscription.status === 'trial';
    const isNotExpired = subscription.currentPeriodEnd && subscription.currentPeriodEnd > Date.now();

    res.json({
      isPremium: isActive && isNotExpired,
      plan: isActive && isNotExpired ? subscription.planId : 'free',
      isTrialing: subscription.status === 'trial',
      expiresAt: subscription.currentPeriodEnd,
    });
  } catch (error) {
    console.error('[Subscriptions] Error checking premium:', error);
    res.json({ isPremium: false, plan: 'free' });
  }
});

// GET /subscriptions/stats - Admin: Get subscription stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Subscription.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const planStats = await Subscription.aggregate([
      {
        $match: { status: { $in: ['active', 'trial'] } },
      },
      {
        $group: {
          _id: '$planId',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalActive = stats
      .filter(s => s._id === 'active' || s._id === 'trial')
      .reduce((sum, s) => sum + s.count, 0);

    const totalUsers = await Subscription.countDocuments();

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalActive,
        byStatus: Object.fromEntries(stats.map(s => [s._id || 'unknown', s.count])),
        byPlan: Object.fromEntries(planStats.map(s => [s._id || 'unknown', s.count])),
      },
    });
  } catch (error) {
    console.error('[Subscriptions] Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch subscription stats',
    });
  }
});

// ==================== WEBHOOK HANDLERS ====================

// Verify webhook signature
const verifyWebhookSignature = (rawBody, signature, timestamp) => {
  if (!signature || !timestamp) {
    return false;
  }

  // Dodo webhook signature format: timestamp.rawBody
  const signedPayload = `${timestamp}.${rawBody}`;
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  // Compare signatures (timing-safe comparison)
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
};

// POST /subscriptions/webhook - Dodo Payments webhook handler
router.post('/webhook', async (req, res) => {
  try {
    // Parse raw body for signature verification
    const rawBody = req.body.toString();
    const event = JSON.parse(rawBody);
    const signature = req.headers['x-dodo-signature'] || req.headers['webhook-signature'];
    const timestamp = req.headers['x-dodo-timestamp'] || req.headers['webhook-timestamp'];
    
    // Verify webhook signature in production
    if (process.env.NODE_ENV === 'production') {
      if (!verifyWebhookSignature(rawBody, signature, timestamp)) {
        console.error('[Subscriptions] Invalid webhook signature');
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const { type, data, business_id, timestamp: eventTimestamp } = event;

    console.log(`[Subscriptions] Webhook received: ${type} at ${eventTimestamp}`);

    switch (type) {
      case 'subscription.active':
        await handleSubscriptionActive(data);
        break;

      case 'subscription.updated':
        await handleSubscriptionUpdated(data);
        break;

      case 'subscription.on_hold':
        await handleSubscriptionOnHold(data);
        break;

      case 'subscription.failed':
        await handleSubscriptionFailed(data);
        break;

      case 'subscription.renewed':
        await handleSubscriptionRenewed(data);
        break;

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(data);
        break;

      case 'payment.succeeded':
        await handlePaymentSucceeded(data);
        break;

      case 'payment.failed':
        await handlePaymentFailed(data);
        break;

      default:
        console.log(`[Subscriptions] Unhandled webhook event: ${type}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('[Subscriptions] Webhook error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Webhook Handlers
async function handleSubscriptionActive(data) {
  const { subscription_id, customer, product_id, current_period_start, current_period_end, trial_end } = data;
  
  const userId = data.metadata?.userId || customer?.metadata?.userId;
  
  if (!userId) {
    console.error('[Subscriptions] No userId found in subscription.active webhook');
    return;
  }

  await Subscription.findOneAndUpdate(
    { userId },
    {
      dodoSubscriptionId: subscription_id,
      dodoCustomerId: customer?.customer_id,
      dodoProductId: product_id,
      planId: PLAN_FROM_PRODUCT[product_id] || 'monthly',
      status: trial_end && trial_end > Date.now() ? 'trial' : 'active',
      currentPeriodStart: new Date(current_period_start).getTime(),
      currentPeriodEnd: new Date(current_period_end).getTime(),
      trialEnd: trial_end ? new Date(trial_end).getTime() : null,
      cancelAtPeriodEnd: false,
      updatedAt: new Date(),
    },
    { upsert: true, new: true }
  );

  console.log(`[Subscriptions] Subscription activated for user ${userId}: ${subscription_id}`);
}

async function handleSubscriptionUpdated(data) {
  const { subscription_id, status, current_period_end, cancel_at_period_end } = data;

  await Subscription.updateOne(
    { dodoSubscriptionId: subscription_id },
    {
      status: mapDodoStatus(status),
      currentPeriodEnd: current_period_end ? new Date(current_period_end).getTime() : undefined,
      cancelAtPeriodEnd: cancel_at_period_end || false,
      updatedAt: new Date(),
    }
  );

  console.log(`[Subscriptions] Subscription updated: ${subscription_id}`);
}

async function handleSubscriptionOnHold(data) {
  const { subscription_id } = data;

  await Subscription.findOneAndUpdate(
    { dodoSubscriptionId: subscription_id },
    {
      status: 'on_hold',
      updatedAt: new Date(),
    },
    { new: true }
  );

  console.log(`[Subscriptions] Subscription on hold: ${subscription_id}`);
}

async function handleSubscriptionFailed(data) {
  const { subscription_id } = data;

  await Subscription.updateOne(
    { dodoSubscriptionId: subscription_id },
    {
      status: 'none',
      updatedAt: new Date(),
    }
  );

  console.log(`[Subscriptions] Subscription failed: ${subscription_id}`);
}

async function handleSubscriptionRenewed(data) {
  const { subscription_id, current_period_start, current_period_end } = data;

  await Subscription.updateOne(
    { dodoSubscriptionId: subscription_id },
    {
      status: 'active',
      currentPeriodStart: new Date(current_period_start).getTime(),
      currentPeriodEnd: new Date(current_period_end).getTime(),
      trialEnd: null, // Trial is over after first renewal
      updatedAt: new Date(),
    }
  );

  console.log(`[Subscriptions] Subscription renewed: ${subscription_id}`);
}

async function handleSubscriptionCancelled(data) {
  const { subscription_id } = data;

  await Subscription.updateOne(
    { dodoSubscriptionId: subscription_id },
    {
      status: 'cancelled',
      cancelledAt: Date.now(),
      updatedAt: new Date(),
    }
  );

  console.log(`[Subscriptions] Subscription cancelled: ${subscription_id}`);
}

async function handlePaymentSucceeded(data) {
  const { subscription_id } = data;

  if (subscription_id) {
    // Update subscription status to active if it was on_hold
    await Subscription.updateOne(
      { dodoSubscriptionId: subscription_id, status: 'on_hold' },
      {
        status: 'active',
        updatedAt: new Date(),
      }
    );
  }

  console.log(`[Subscriptions] Payment succeeded for subscription: ${subscription_id}`);
}

async function handlePaymentFailed(data) {
  const { subscription_id } = data;
  console.log(`[Subscriptions] Payment failed for subscription: ${subscription_id}`);
}

// Helper function to map Dodo status to our status
function mapDodoStatus(dodoStatus) {
  const statusMap = {
    'active': 'active',
    'trialing': 'trial',
    'on_hold': 'on_hold',
    'cancelled': 'cancelled',
    'expired': 'expired',
  };
  return statusMap[dodoStatus] || 'none';
}

module.exports = router;
module.exports.Subscription = Subscription;
