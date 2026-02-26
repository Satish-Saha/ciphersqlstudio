const { pool } = require('../config/postgres');

/**
 * Maps MongoDB data types to PostgreSQL data types
 */
const mapDataType = (type) => {
    const typeMap = {
        'INTEGER': 'INTEGER',
        'INT': 'INTEGER',
        'TEXT': 'TEXT',
        'VARCHAR': 'VARCHAR(255)',
        'REAL': 'REAL',
        'FLOAT': 'REAL',
        'BOOLEAN': 'BOOLEAN',
        'BOOL': 'BOOLEAN',
        'DATE': 'DATE',
        'TIMESTAMP': 'TIMESTAMP',
        'NUMERIC': 'NUMERIC',
        'DECIMAL': 'DECIMAL',
        'SERIAL': 'INTEGER',
        'BIGINT': 'BIGINT',
    };
    return typeMap[type.toUpperCase()] || 'TEXT';
};

/**
 * Gets schema name for an assignment. Uses assignment ID suffix for uniqueness.
 */
const getSchemaName = (assignmentId) => {
    return `workspace_${assignmentId.toString().slice(-8)}`;
};

/**
 * Sets up a PostgreSQL schema for a given assignment with its sample data.
 * Idempotent - drops and recreates schema each time for clean state.
 */
const setupWorkspace = async (assignmentId, sampleTables) => {
    const schemaName = getSchemaName(assignmentId);
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Drop and recreate schema for clean state
        await client.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
        await client.query(`CREATE SCHEMA "${schemaName}"`);

        // Set search path
        await client.query(`SET search_path TO "${schemaName}"`);

        for (const table of sampleTables) {
            // Build CREATE TABLE statement
            const colDefs = table.columns.map((col) => {
                return `"${col.columnName}" ${mapDataType(col.dataType)}`;
            }).join(', ');

            await client.query(
                `CREATE TABLE "${schemaName}"."${table.tableName}" (${colDefs})`
            );

            // Insert rows if any
            if (table.rows && table.rows.length > 0) {
                for (const row of table.rows) {
                    const colNames = table.columns.map((c) => `"${c.columnName}"`).join(', ');
                    const vals = table.columns.map((c) => row[c.columnName]);
                    const placeholders = vals.map((_, i) => `$${i + 1}`).join(', ');

                    await client.query(
                        `INSERT INTO "${schemaName}"."${table.tableName}" (${colNames}) VALUES (${placeholders})`,
                        vals
                    );
                }
            }
        }

        await client.query('COMMIT');
        return schemaName;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

/**
 * Executes a user SQL query within the assignment's sandboxed schema.
 */
const executeQuery = async (assignmentId, sql) => {
    const schemaName = getSchemaName(assignmentId);
    const client = await pool.connect();

    try {
        // Set search path to the assignment schema
        await client.query(`SET search_path TO "${schemaName}", public`);

        const result = await client.query(sql);

        return {
            columns: result.fields ? result.fields.map((f) => f.name) : [],
            rows: result.rows || [],
            rowCount: result.rowCount || 0,
        };
    } finally {
        client.release();
    }
};

/**
 * Destroys the workspace schema (cleanup)
 */
const destroyWorkspace = async (assignmentId) => {
    const schemaName = getSchemaName(assignmentId);
    await pool.query(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`);
};

module.exports = { setupWorkspace, executeQuery, destroyWorkspace, getSchemaName };
