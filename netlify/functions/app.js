const express = require('express');
const path = require('path');
require('dotenv').config();
const serverless = require('serverless-http');

const app = express();

const documentRoutes = require('../../routes/articles');
const rootDir = path.resolve(__dirname, '../../');

app.use(express.static(rootDir));
app.use("/assets", express.static(path.join(rootDir, 'assets')));

// FIX: Mount the router on BOTH variations of the path 
// This ensures that Netlify's internal function pathing resolves perfectly
app.use('/api', documentRoutes);
app.use('/.netlify/functions/app/api', documentRoutes); 

app.get('/', (req, res) => {
    res.sendFile(path.join(rootDir, 'assets/html/intro', 'intro.html'));
});

// Alternative structural catch-all fix for root file path references
app.get('/.netlify/functions/app', (req, res) => {
    res.sendFile(path.join(rootDir, 'assets/html/intro', 'intro.html'));
});

module.exports.handler = serverless(app);
