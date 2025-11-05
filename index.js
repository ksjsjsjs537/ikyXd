const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Import API handlers
const { tiktokdl } = require('./api/d/tiktok.js');
const { igdl } = require('./api/d/instagram.js');
const { xnxxdl, xnxxsearch } = require('./api/d/xnxxdl.js');
const { BratGenerator } = require('./api/f/brat.js');
const { SSIPGenerator } = require('./api/f/ssip.js');
const { githubstalk } = require('./api/s/githubstalk.js');
const igstalk = require('./api/s/igstalk.js');
const { SubdomainFinder } = require('./api/s/subdomainfinder.js');
const { ttSearch } = require('./api/s/tiktoksearch.js');

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Example endpoint
app.get('/api/hello', (req, res) => {
  res.status(200).json({
    status: true,
    message: "Hello from your API!",
    author: "Ngadinem yeyey",
  });
});

// Quotes endpoint
app.get('/api/quotes', (req, res) => {
  const quotes = [
    "Semangat terus, jangan nyerah!",
    "Waktu terbaik untuk memulai adalah sekarang.",
    "Hidup itu bukan tentang menunggu badai berlalu, tapi belajar menari di tengah hujan.",
  ];
  const random = quotes[Math.floor(Math.random() * quotes.length)];
  res.status(200).json({
    status: true,
    quote: random,
  });
});

// Downloader endpoints
app.get('/api/d/tiktok', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL parameter is required" });
    const result = await tiktokdl.fetchData(url);
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/d/instagram', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL parameter is required" });
    const result = await igdl(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/d/xnxxdl', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ status: false, message: "URL parameter is required" });
    const result = await xnxxdl(url);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/d/xnxxsearch', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ status: false, message: "Query parameter is required" });
    const result = await xnxxsearch(query);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Feature endpoints
app.get('/api/f/brat', async (req, res) => {
  try {
    const { text } = req.query;
    if (!text) return res.status(400).json({ status: false, message: "Text parameter is required" });
    const result = await BratGenerator(text);
    if (result) {
      res.set('Content-Type', 'image/png');
      res.send(result);
    } else {
      res.status(500).json({ status: false, message: "Failed to generate image" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/f/ssip', async (req, res) => {
  try {
    const { text, batre, time, signal, emoji, carrier } = req.query;
    if (!text) return res.status(400).json({ status: false, message: "Text parameter is required" });
    const result = await SSIPGenerator({ text, batre, time, signal, emoji, carrier });
    if (result) {
      res.set('Content-Type', 'image/png');
      res.send(result);
    } else {
      res.status(500).json({ status: false, message: "Failed to generate image" });
    }
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Search/Stalk endpoints
app.get('/api/s/githubstalk', async (req, res) => {
  try {
    const { user } = req.query;
    if (!user) return res.status(400).json({ status: false, message: "User parameter is required" });
    const result = await githubstalk(user);
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/s/igstalk', async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) return res.status(400).json({ status: false, message: "Username parameter is required" });
    const result = await igstalk.stalk(username);
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/s/subdomainfinder', async (req, res) => {
  try {
    const { domain } = req.query;
    if (!domain) return res.status(400).json({ status: false, message: "Domain parameter is required" });
    const result = await SubdomainFinder(domain);
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

app.get('/api/s/tiktoksearch', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ status: false, message: "Query parameter is required" });
    const result = await ttSearch(query);
    res.status(200).json({ status: true, result });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

// Catch-all (for SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

module.exports = app;