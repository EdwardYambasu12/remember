const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const cors = require("cors")

// Define schema
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: String,
  content: String,
  author: String,
  category: String,
  readTime: String,
  image: String,
  publishedAt: { type: Date, default: Date.now }
});

const NewsModel = mongoose.model('News', newsSchema);
const News = express.Router();
News.use(cors());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads/news-images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Parse JSON bodies
News.use(express.json());

// POST endpoint for news article
News.post('/api/news', upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, author, category, readTime } = req.body;

    // Build full URL for image
    let imageUrl = null;
    if (req.file) {
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      console.log("Base URL:", baseUrl);
      console.log("Image URL:", imageUrl);
      imageUrl = `https://remember-1u57.onrender.com/uploads/news-images/${req.file.filename}`;
      console.log("Image URL:", imageUrl);
    } else if (req.body.image) {
      imageUrl = req.body.image; // fallback if passed directly
    }

    // Save to MongoDB
    const newsArticle = new NewsModel({
      title,
      excerpt,
      content,
      author,
      category,
      readTime,
      image: imageUrl
    });

    const savedArticle = await newsArticle.save();

    console.log("News article saved:", savedArticle);
    res.status(201).json({ success: true, article: savedArticle });
  } catch (error) {
    console.error("Error saving news:", error);
    res.status(500).json({ success: false, message: "Failed to save news" });
  }
});

// Serve uploaded images statically
News.use('/uploads/news-images', express.static(uploadDir));

News.get("/news/main_news", async(req, res)=>{
  try {
    const data = await NewsModel.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

News.get('/news/main_news/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid article ID' });
    }
    
    // Find the article by ID
    const article = await NewsModel.findById(id);

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    res.json(article);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = News;
