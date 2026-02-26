const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const UserProgress = require('../models/UserProgress');

// GET /api/progress/:assignmentId - get progress for current user
router.get('/:assignmentId', authMiddleware, async (req, res) => {
    try {
        const progress = await UserProgress.findOne({
            userId: req.user.id,
            assignmentId: req.params.assignmentId,
        });
        res.json({ success: true, data: progress || null });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// POST /api/progress/save - save/update user progress
router.post('/save', authMiddleware, async (req, res) => {
    try {
        const { assignmentId, sqlQuery, isCompleted } = req.body;

        const progress = await UserProgress.findOneAndUpdate(
            { userId: req.user.id, assignmentId },
            {
                $set: { sqlQuery, lastAttempt: new Date() },
                $setOnInsert: { userId: req.user.id, assignmentId },
                $inc: { attemptCount: 1 },
                ...(isCompleted !== undefined && { $set: { isCompleted } }),
            },
            { upsert: true, new: true }
        );

        res.json({ success: true, data: progress });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/progress - get all progress for current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const progress = await UserProgress.find({ userId: req.user.id })
            .populate('assignmentId', 'title difficulty');
        res.json({ success: true, data: progress });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
