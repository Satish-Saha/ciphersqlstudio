const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generates a helpful hint (NOT the solution) for the user's SQL problem.

const generateHint = async ({ question, userSql, sampleTables }) => {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const tableInfo = sampleTables.map((t) => {
        const cols = t.columns.map((c) => `${c.columnName} (${c.dataType})`).join(', ');
        return `Table "${t.tableName}": ${cols}`;
    }).join('\n');

    const prompt = `You are a SQL tutor helping a student learn SQL. Your role is to provide HINTS only - never give the full answer or complete SQL query.

Assignment Question:
"${question}"

Available Tables:
${tableInfo}

Student's Current SQL Attempt:
${userSql ? `\`\`\`sql\n${userSql}\n\`\`\`` : '(The student has not written any query yet)'}

Instructions for your response:
1. Analyze what the student is trying to do and what's wrong or missing
2. Give a conceptual hint that guides them in the right direction
3. You MAY mention which SQL clause or keyword they should think about (e.g., "Consider using GROUP BY", "Think about what JOIN would connect these tables", "A WHERE clause can help filter your results")
4. DO NOT write out the complete SQL query for them
5. DO NOT reveal the exact answer by providing the exact conditions or values
6. Keep your hint to 2-4 sentences maximum
7. Be encouraging and educational

Respond with only your hint, no preamble.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
};

module.exports = { generateHint };