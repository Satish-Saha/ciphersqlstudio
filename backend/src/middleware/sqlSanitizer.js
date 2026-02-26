/**
 * SQL Sanitizer Middleware
 * Blocks dangerous SQL operations from students.
 * Only SELECT queries are allowed in the sandbox.
 */

// Dangerous SQL keywords that students should not be able to execute
const BLOCKED_PATTERNS = [
    /^\s*DROP\s+/i,
    /^\s*DELETE\s+/i,
    /^\s*UPDATE\s+/i,
    /^\s*INSERT\s+/i,
    /^\s*ALTER\s+/i,
    /^\s*TRUNCATE\s+/i,
    /^\s*CREATE\s+/i,
    /^\s*GRANT\s+/i,
    /^\s*REVOKE\s+/i,
    /^\s*EXEC\s+/i,
    /^\s*EXECUTE\s+/i,
    /;\s*DROP\s+/i,
    /;\s*DELETE\s+/i,
    /;\s*UPDATE\s+/i,
    /;\s*INSERT\s+/i,
    /;\s*ALTER\s+/i,
    /;\s*TRUNCATE\s+/i,
    /;\s*CREATE\s+/i,
    /--/, // SQL comments that could be used for injection
    /\/\*/,  // Block comment start
];

const sqlSanitizer = (req, res, next) => {
    const { sql } = req.body;

    if (!sql || typeof sql !== 'string') {
        return res.status(400).json({ success: false, message: 'SQL query is required' });
    }

    const trimmed = sql.trim();

    if (!trimmed) {
        return res.status(400).json({ success: false, message: 'SQL query cannot be empty' });
    }

    if (trimmed.length > 5000) {
        return res.status(400).json({ success: false, message: 'SQL query is too long (max 5000 characters)' });
    }

    for (const pattern of BLOCKED_PATTERNS) {
        if (pattern.test(trimmed)) {
            return res.status(403).json({
                success: false,
                message: '🚫 Query blocked: Only SELECT statements are allowed in the sandbox. DROP, DELETE, UPDATE, INSERT, and other modification operations are not permitted.',
            });
        }
    }

    // Must start with SELECT (after trimming)
    if (!/^\s*SELECT\s+/i.test(trimmed) && !/^\s*WITH\s+/i.test(trimmed)) {
        return res.status(403).json({
            success: false,
            message: '🚫 Only SELECT queries are allowed. Please write a SELECT statement.',
        });
    }

    next();
};

module.exports = sqlSanitizer;
