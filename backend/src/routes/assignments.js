const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');

// GET /api/assignments - list all assignments
router.get('/', async (req, res) => {
    try {
        const { difficulty, search } = req.query;
        const filter = {};

        if (difficulty && difficulty !== 'all') {
            filter.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        const assignments = await Assignment.find(filter)
            .select('title description difficulty tags sampleTables createdAt')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: assignments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// GET /api/assignments/:id - get single assignment with full details
router.get('/:id', async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }
        res.json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;