const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

function generateShortCode() {
    return crypto.randomBytes(3).toString('hex');
}

function formatUrlResponse(row) {
    return {
        id: row.id.toString(),
        url: row.url,
        shortCode: row.shortCode,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    };
}

// Create short URL
app.post('/shorten', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    try {
        new URL(url);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    let shortCode;
    let isUnique = false;
    let retries = 5;
    while (!isUnique && retries > 0) {
        shortCode = generateShortCode();
        const existing = await db.get('SELECT id FROM urls WHERE shortCode = ?', [shortCode]);
        if (!existing) isUnique = true;
        retries--;
    }
    if (!isUnique) return res.status(500).json({ error: 'Failed to generate a unique shortcode' });

    const now = new Date().toISOString();
    
    try {
        const result = await db.run(
            'INSERT INTO urls (url, shortCode, createdAt, updatedAt, accessCount) VALUES (?, ?, ?, ?, ?)',
            [url, shortCode, now, now, 0]
        );
        const newUrl = await db.get('SELECT * FROM urls WHERE id = ?', [result.lastID]);
        res.status(201).json(formatUrlResponse(newUrl));
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Retrieve original URL
app.get('/shorten/:shortCode', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM urls WHERE shortCode = ?', [req.params.shortCode]);
        if (!row) {
            // Also matching GET /shorten/:shortCode/stats if defined after, so move stats above this or handle exact routes
            return res.status(404).json({ error: 'Short URL not found' });
        }

        await db.run('UPDATE urls SET accessCount = accessCount + 1 WHERE id = ?', [row.id]);
        res.status(200).json(formatUrlResponse(row));
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get URL Statistics (Must be defined before /shorten/:shortCode if using the same base, wait, /shorten/:shortCode/stats is more specific so it won't conflict with /shorten/:shortCode. It conflicts if we had /shorten/stats. The current order is fine, but let's move it to avoid express routing bugs). Actually /shorten/:shortCode doesn't match /shorten/:shortCode/stats.
app.get('/shorten/:shortCode/stats', async (req, res) => {
    try {
        const row = await db.get('SELECT * FROM urls WHERE shortCode = ?', [req.params.shortCode]);
        if (!row) return res.status(404).json({ error: 'Short URL not found' });

        const response = formatUrlResponse(row);
        response.accessCount = row.accessCount;
        
        res.status(200).json(response);
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update Short URL
app.put('/shorten/:shortCode', async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    try {
        new URL(url);
    } catch (e) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    try {
        const row = await db.get('SELECT * FROM urls WHERE shortCode = ?', [req.params.shortCode]);
        if (!row) return res.status(404).json({ error: 'Short URL not found' });

        const now = new Date().toISOString();
        await db.run('UPDATE urls SET url = ?, updatedAt = ? WHERE id = ?', [url, now, row.id]);

        const updatedRow = await db.get('SELECT * FROM urls WHERE id = ?', [row.id]);
        res.status(200).json(formatUrlResponse(updatedRow));
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Delete Short URL
app.delete('/shorten/:shortCode', async (req, res) => {
    try {
        const row = await db.get('SELECT id FROM urls WHERE shortCode = ?', [req.params.shortCode]);
        if (!row) return res.status(404).json({ error: 'Short URL not found' });

        await db.run('DELETE FROM urls WHERE id = ?', [row.id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
