const express = require('express');
const router = express.Router();
const path = require('path');
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Replaces escaped string newlines if formatted incorrectly in deployment UI
        private_key: process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined
    },
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