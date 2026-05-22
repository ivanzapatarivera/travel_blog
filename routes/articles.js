const express = require('express');
const router = express.Router();
const path = require('path');
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '..', 'sa_key.json'),
    scopes: ['https://www.googleapis.com/auth/documents.readonly']
});

router.get('/get-doc-url', async (req, res) => {
    const URL = process.env.GOOGLE_DOC_URL;
    if (!URL) return res.status(500).json({ error: "Missing GOOGLE_DOC_URL inside your .env file." });

    const matches = URL.match(/\/document\/d\/([a-zA-Z0-9-_]+)/);
    if (!matches) return res.status(400).json({ error: "Invalid Google Doc URL format." });
    const documentId = matches[1];

    const DOCS = google.docs({
        version: "v1",
        auth
    }); 

    const result = await DOCS.documents.get({ documentId });
    if (!result.data) return res.status(404).json({ error: "Document not found." });
    res.json(result.data);
});

module.exports = router;