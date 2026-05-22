const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();

const documentRoutes = require('./routes/articles');

app.use(express.static(path.join(__dirname)));
app.use("/assets", express.static(path.join(__dirname, 'assets')));
app.use('/api', documentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'assets/html/intro', 'intro.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});