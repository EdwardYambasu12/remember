const axios = require("axios");
const { getOrGenerateToken } = require('./tokenMiddleware');
const mongoose = require('mongoose');
require('dotenv').config();

const FACEBOOK_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

// MongoDB Schema for posted news
const postedNewsSchema = new mongoose.Schema({
    newsId: { type: String, required: true, unique: true },
    postedAt: { type: Date, default: Date.now }
});

const PostedNews = mongoose.model('PostedNews', postedNewsSchema);

let previousnews = [];
let fotmobToken = null;
let isInitialized = false;

// Clean up old posted news (older than 7 days)
async function cleanupOldNews() {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const result = await PostedNews.deleteMany({ postedAt: { $lt: sevenDaysAgo } });
        if (result.deletedCount > 0) {
            console.log(`[Meta News Bot] Cleaned up ${result.deletedCount} old news items (>7 days)`);
        }
    } catch (error) {
        console.error('[Meta News Bot] Error cleaning up old news:', error.message);
    }
}

// Load previously posted news IDs from MongoDB
async function loadPostedNews() {
    try {
        // First, clean up old news items
        await cleanupOldNews();
        
        const postedItems = await PostedNews.find();
        const postedIds = postedItems.map(item => item.newsId);
        console.log(`[Meta News Bot] Loaded ${postedIds.length} previously posted news IDs from MongoDB`);
        return postedIds;
    } catch (error) {
        console.error('[Meta News Bot] Error loading posted news from MongoDB:', error.message);
        return [];
    }
}

// Save posted news ID to MongoDB
async function savePostedNewsItem(newsId) {
    try {
        await PostedNews.create({ newsId });
    } catch (error) {
        if (error.code !== 11000) { // Ignore duplicate key errors
            console.error('[Meta News Bot] Error saving posted news to MongoDB:', error.message);
        }
    }
}

// Initialize token
async function initializeToken() {
    try {
        const startIndex = 0;
        const page = 1;
        fotmobToken = await getOrGenerateToken('news', {
            urlPath: `/api/news/latestNews?startIndex=${startIndex}&lang=en-GB&page=${page}`
        });
        console.log('[Meta News Bot] FotMob token initialized');
        isInitialized = true;
    } catch (error) {
        console.error('[Meta News Bot] Error initializing token:', error.message);
        throw error;
    }
}

// Fetch news from FotMob API
async function news_fetch() {
    if (!isInitialized) {
        await initializeToken();
    }

    const response = await axios.get('https://www.fotmob.com/api/news/latestNews', {
        params: {
            'startIndex': 0,
            'lang': 'en-GB',
            'page': 1
        },
        headers: {
            'accept': '*/*',
            'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15',
            'x-mas': fotmobToken
        }
    });

    return response.data;
}

// Compare latest news with old news to find new items
async function news_change(latestNews, oldNews) {
    const difference = latestNews.filter(item1 => 
        !oldNews.some(item2 => item2.id === item1.id)
    );

    return difference;
}

// Publish photo post to Facebook
async function publishToFacebook(message, photoUrl) {
    try {
        const response = await axios.post(
            `https://graph.facebook.com/v24.0/${FACEBOOK_PAGE_ID}/photos`,
            null,
            {
                params: {
                    message: message,
                    url: photoUrl,
                    published: true,
                    access_token: FACEBOOK_ACCESS_TOKEN
                }
            }
        );

        console.log(`[Facebook] ✓ Posted: "${message.substring(0, 50)}..." | Post ID: ${response.data.id}`);
        return response.data.id;
    } catch (error) {
        console.error('[Facebook] ✗ Error:', error.response?.data?.error?.message || error.message);
        if (error.response?.data) {
            console.error('[Facebook] Full error:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

// Publish photo post to Instagram
async function publishToInstagram(caption, imageUrl) {
    try {
        console.log(`[Instagram] Creating media with URL: ${imageUrl.substring(0, 60)}...`);
        
        // Step 1: Create media container
        const createResponse = await axios.post(
            `https://graph.instagram.com/v21.0/${INSTAGRAM_USER_ID}/media`,
            null, 
            {
                params: {
                    image_url: imageUrl,
                    caption: caption,
                    access_token: INSTAGRAM_ACCESS_TOKEN,
                },
            }
        );
        
        const creationId = createResponse.data.id;
        console.log(`[Instagram] Media container created: ${creationId}. Waiting 10 seconds for processing...`);

        // Step 2: Wait for Instagram to process the image (Instagram needs time)
        await new Promise(resolve => setTimeout(resolve, 10000));

        // Step 3: Publish the media container
        const publishResponse = await axios.post(
            `https://graph.instagram.com/v21.0/${INSTAGRAM_USER_ID}/media_publish`,
            null, 
            {
                params: {
                    creation_id: creationId,
                    access_token: INSTAGRAM_ACCESS_TOKEN,
                },
            }
        );

        console.log(`[Instagram] ✓ Posted: "${caption.substring(0, 50)}..." | Post ID: ${publishResponse.data.id}`);
        return publishResponse.data.id;
    } catch (error) {
        console.error('[Instagram] ✗ Error:', error.response?.data?.error?.message || error.message);
        if (error.response?.data) {
            console.error('[Instagram] Full error:', JSON.stringify(error.response.data, null, 2));
        }
        return null;
    }
}

// Process news items and post to both Facebook and Instagram
async function processNews(newsItems) {
    if (!newsItems || newsItems.length === 0) {
        return;
    }

    console.log(`[Meta News Bot] Processing ${newsItems.length} new news item(s)...`);

    for (const item of newsItems) {
        try {
            const title = item.lead
                ? `${item.title}\n\n${item.lead}\n\n More news at www.lonescore.com`
                : `${item.title}\n\n More news at www.lonescore.com`;

            // Clean image URL by removing query parameters
            const cleanImageUrl = item.imageUrl.split('?')[0];

            // Post to Facebook
            await publishToFacebook(title, cleanImageUrl);
            
            // Wait 3 seconds before posting to Instagram
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Post to Instagram
            await publishToInstagram(title, cleanImageUrl);

            // Save to MongoDB after successful posting
            await savePostedNewsItem(item.id);

            // Wait 5 seconds before processing next item
            await new Promise(resolve => setTimeout(resolve, 5000));

        } catch (error) {
            console.error(`[Meta News Bot] Error processing news item "${item.title}":`, error.message);
        }
    }
}

// Main function to fetch and process news
async function fetchAndPostNews() {
    try {
        console.log('[Meta News Bot] Fetching latest news...');
        
        const news_data_new = await news_fetch();
        const news_data_change = await news_change(news_data_new, previousnews);

        if (news_data_change.length > 0) {
            await processNews(news_data_change);
        } else {
            console.log('[Meta News Bot] No new news items');
        }

        previousnews = news_data_new;

    } catch (error) {
        console.error('[Meta News Bot] Error fetching/posting news:', error.message);
    } finally {
        // Fetch again after 1 minute (60000ms)
        setTimeout(fetchAndPostNews, 60000);
    }
}

// Start the news fetching and posting process
async function startMetaNewsBot() {
    console.log('\n' + '='.repeat(60));
    console.log('Meta News Bot Started');
    console.log('='.repeat(60));
    console.log('Fetching news from: https://www.fotmob.com/api/news/latestNews');
    console.log('Interval: Every 1 minute');
    console.log('Posting to: Facebook & Instagram');
    console.log('Storage: MongoDB');
    console.log('='.repeat(60) + '\n');

    // Load previously posted news from MongoDB to avoid duplicates after restart
    const postedIds = await loadPostedNews();
    if (postedIds.length > 0) {
        // Reconstruct previousnews with just IDs to avoid duplicates
        previousnews = postedIds.map(id => ({ id }));
    }

    await fetchAndPostNews();
}

module.exports = {
    startMetaNewsBot,
    news_fetch,
    news_change,
    publishToFacebook,
    publishToInstagram,
    processNews
};
