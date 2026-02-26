const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const sqlSanitizer = require('../middleware/sqlSanitizer');
const { setupWorkspace, executeQuery } = require('../services/postgresService');

// POST /api/query/execute
router.post('/execute', sqlSanitizer, async (req, res) => {
    const { assignmentId, sql } = req.body;

    if (!assignmentId) {
        return res.status(400).json({ success: false, message: 'assignmentId is required' });
    }

    try {
        // Load assignment for sample tables
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ success: false, message: 'Assignment not found' });
        }

        // Set up workspace (idempotent)
        await setupWorkspace(assignmentId, assignment.sampleTables);

        // Execute the user's query
        const result = await executeQuery(assignmentId, sql);

        res.json({
            success: true,
            data: {
                columns: result.columns,
                rows: result.rows,
                rowCount: result.rowCount,
            },
        });
    } catch (err) {
        // PostgreSQL errors return useful messages
        const pgError = err.message || 'Query execution failed';
        res.status(400).json({
            success: false,
            message: pgError,
            detail: err.detail || null,
            hint: err.hint || null,
        });
    }
});

module.exports = router;
