const express = require('express');
const router = express.Router();
const { generateHint } = require('../services/llmService');

// POST /api/hint
router.post('/', async (req, res) => {
    const { question, userSql, sampleTables } = req.body;

    if (!question) {
        return res.status(400).json({ success: false, message: 'question is required' });
    }

    try {
        const hint = await generateHint({ question, userSql: userSql || '', sampleTables: sampleTables || [] });
        res.json({ success: true, hint });
    } catch (err) {
        console.error('LLM Error:', err.message);
        res.status(500).json({
            success: false,
            message: 'Failed to generate hint. Please check your GEMINI_API_KEY or try again later.',
        });
    }
});

module.exports = router;
