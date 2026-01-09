// ad-analytics.js - Backend API for Ad Click Tracking (MongoDB Production Version)
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// MongoDB Schema for Ad Clicks
const adClickSchema = new mongoose.Schema({
  adId: { type: String, required: true, index: true },
  timestamp: { type: Number, required: true },
  page: { type: String, required: true },
  position: { type: Number, required: true },
  userId: { type: String, default: null, index: true },
  ip: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

// Compound indexes for faster queries
adClickSchema.index({ adId: 1, timestamp: -1 });
adClickSchema.index({ userId: 1, timestamp: -1 });
adClickSchema.index({ page: 1, timestamp: -1 });

const AdClick = mongoose.model('AdClick', adClickSchema);

// Middleware to parse JSON
router.use(express.json());

// POST /ad-analytics - Receive ad click events
router.post('/', async (req, res) => {
  try {
    const { adId, timestamp, page, position, userId } = req.body;

    // Validate required fields
    if (!adId || !timestamp || !page || position === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: adId, timestamp, page, position',
      });
    }

    // Create and save click event to MongoDB
    const clickEvent = new AdClick({
      adId,
      timestamp,
      page,
      position,
      userId: userId || null,
      ip: req.ip || req.headers['x-forwarded-for'] || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    });

    await clickEvent.save();

    console.log(`Ad click recorded: ${adId} by user ${userId || 'anonymous'} on ${page}`);

    res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      clickId: clickEvent._id,
    });
  } catch (error) {
    console.error('Error tracking ad click:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /ad-analytics - Get all analytics with aggregation (admin endpoint)
router.get('/', async (req, res) => {
  try {
    const { adId, startDate, endDate, userId, limit = 100 } = req.query;

    // Build filter query
    const filter = {};
    if (adId) filter.adId = adId;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate).getTime();
      if (endDate) filter.timestamp.$lte = new Date(endDate).getTime();
    }

    // Get filtered clicks
    const clicks = await AdClick.find(filter)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    // Get aggregated analytics
    const matchStage = Object.keys(filter).length > 0 ? { $match: filter } : { $match: {} };
    
    const analytics = await AdClick.aggregate([
      matchStage,
      {
        $group: {
          _id: '$adId',
          totalClicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' },
          lastClicked: { $max: '$timestamp' },
          firstClicked: { $min: '$timestamp' },
          clicksByPage: { $push: '$page' },
          clicksByPosition: { $push: '$position' },
        },
      },
      {
        $project: {
          adId: '$_id',
          totalClicks: 1,
          uniqueUsers: {
            $size: {
              $filter: {
                input: '$uniqueUsers',
                as: 'user',
                cond: { $ne: ['$$user', null] }
              }
            }
          },
          lastClicked: 1,
          firstClicked: 1,
          _id: 0,
        },
      },
      { $sort: { totalClicks: -1 } }
    ]);

    // Get detailed analytics per ad if specific adId requested
    let detailedAnalytics = {};
    if (adId && analytics.length > 0) {
      const clicksByPage = await AdClick.aggregate([
        { $match: { adId } },
        { $group: { _id: '$page', count: { $sum: 1 } } }
      ]);
      
      const clicksByPosition = await AdClick.aggregate([
        { $match: { adId } },
        { $group: { _id: '$position', count: { $sum: 1 } } }
      ]);

      detailedAnalytics = {
        clicksByPage: Object.fromEntries(clicksByPage.map(p => [p._id, p.count])),
        clicksByPosition: Object.fromEntries(clicksByPosition.map(p => [p._id, p.count])),
      };
    }

    res.status(200).json({
      success: true,
      data: {
        clicks,
        analytics: adId ? { ...analytics[0], ...detailedAnalytics } : analytics,
        summary: {
          totalClicks: clicks.length,
          totalAds: analytics.length,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /ad-analytics/stats - Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startTime = Date.now() - (parseInt(days) * 24 * 60 * 60 * 1000);

    const stats = await AdClick.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: null,
          totalClicks: { $sum: 1 },
          uniqueAds: { $addToSet: '$adId' },
          uniqueUsers: { $addToSet: '$userId' },
          uniquePages: { $addToSet: '$page' },
        }
      },
      {
        $project: {
          _id: 0,
          totalClicks: 1,
          uniqueAds: { $size: '$uniqueAds' },
          uniqueUsers: {
            $size: {
              $filter: {
                input: '$uniqueUsers',
                as: 'user',
                cond: { $ne: ['$$user', null] }
              }
            }
          },
          uniquePages: { $size: '$uniquePages' },
        }
      }
    ]);

    // Get clicks per day for the period
    const dailyClicks = await AdClick.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: { $toDate: '$timestamp' }
            }
          },
          clicks: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top performing ads
    const topAds = await AdClick.aggregate([
      { $match: { timestamp: { $gte: startTime } } },
      {
        $group: {
          _id: '$adId',
          clicks: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          adId: '$_id',
          clicks: 1,
          uniqueUsers: {
            $size: {
              $filter: {
                input: '$uniqueUsers',
                as: 'user',
                cond: { $ne: ['$$user', null] }
              }
            }
          },
          _id: 0
        }
      },
      { $sort: { clicks: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period: `Last ${days} days`,
        summary: stats[0] || { totalClicks: 0, uniqueAds: 0, uniqueUsers: 0, uniquePages: 0 },
        dailyClicks,
        topAds,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /ad-analytics/user/:userId - Get clicks by user
// NOTE: This must be BEFORE /:adId to avoid route conflicts
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const userClicks = await AdClick.find({ userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .lean();

    // Get unique ads seen by user
    const adsSeenResult = await AdClick.distinct('adId', { userId });

    // Get clicks per ad
    const clicksPerAd = await AdClick.aggregate([
      { $match: { userId } },
      { $group: { _id: '$adId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        userId,
        totalClicks: await AdClick.countDocuments({ userId }),
        clicks: userClicks,
        adsSeen: adsSeenResult,
        clicksPerAd: Object.fromEntries(clicksPerAd.map(a => [a._id, a.count])),
      },
    });
  } catch (error) {
    console.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// GET /ad-analytics/:adId - Get analytics for specific ad
// NOTE: This parameterized route must be LAST among GET routes
router.get('/:adId', async (req, res) => {
  try {
    const { adId } = req.params;

    // Get total count
    const totalClicks = await AdClick.countDocuments({ adId });

    if (totalClicks === 0) {
      return res.status(404).json({
        success: false,
        error: 'Ad not found',
      });
    }

    // Get unique users count
    const uniqueUsersResult = await AdClick.aggregate([
      { $match: { adId } },
      { $group: { _id: '$userId' } },
      { $match: { _id: { $ne: null } } },
      { $count: 'count' }
    ]);
    const uniqueUsers = uniqueUsersResult[0]?.count || 0;

    // Get clicks by page
    const clicksByPageResult = await AdClick.aggregate([
      { $match: { adId } },
      { $group: { _id: '$page', count: { $sum: 1 } } }
    ]);
    const clicksByPage = Object.fromEntries(clicksByPageResult.map(p => [p._id, p.count]));

    // Get clicks by position
    const clicksByPositionResult = await AdClick.aggregate([
      { $match: { adId } },
      { $group: { _id: '$position', count: { $sum: 1 } } }
    ]);
    const clicksByPosition = Object.fromEntries(clicksByPositionResult.map(p => [p._id, p.count]));

    // Get last clicked and first clicked
    const timeRange = await AdClick.aggregate([
      { $match: { adId } },
      { $group: { _id: null, lastClicked: { $max: '$timestamp' }, firstClicked: { $min: '$timestamp' } } }
    ]);

    // Get recent clicks
    const recentClicks = await AdClick.find({ adId })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        adId,
        totalClicks,
        uniqueUsers,
        clicksByPage,
        clicksByPosition,
        lastClicked: timeRange[0]?.lastClicked,
        firstClicked: timeRange[0]?.firstClicked,
        recentClicks,
      },
    });
  } catch (error) {
    console.error('Error fetching ad analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// DELETE /ad-analytics - Clear all analytics (admin endpoint)
router.delete('/', async (req, res) => {
  try {
    // Optional: Add authentication/authorization here
    const result = await AdClick.deleteMany({});

    res.status(200).json({
      success: true,
      message: 'All analytics cleared',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// DELETE /ad-analytics/:adId - Delete analytics for specific ad
router.delete('/:adId', async (req, res) => {
  try {
    const { adId } = req.params;
    const result = await AdClick.deleteMany({ adId });

    res.status(200).json({
      success: true,
      message: `Analytics cleared for ad: ${adId}`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('Error clearing ad analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

module.exports = router;
