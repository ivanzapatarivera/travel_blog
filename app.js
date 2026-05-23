const express = require('express');
const path = require('path');
require('dotenv').config();
const serverless = require('serverless-http');

const app = express();

const documentRoutes = require('./routes/articles');

app.use(express.static(path.join(__dirname)));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
app.use('/api', documentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/html/intro', 'intro.html'));
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
}   );

module.exports.handler = serverless(app);