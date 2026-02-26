require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment');

const assignments = [
    {
        title: 'Basic SELECT Query',
        description: 'Learn how to retrieve all records from a table using a simple SELECT statement.',
        difficulty: 'Easy',
        question: 'Write a SQL query to retrieve all columns and all rows from the "employees" table.',
        tags: ['SELECT', 'Basic'],
        sampleTables: [
            {
                tableName: 'employees',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'department', dataType: 'TEXT' },
                    { columnName: 'salary', dataType: 'REAL' },
                    { columnName: 'hire_date', dataType: 'TEXT' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000, hire_date: '2021-03-15' },
                    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000, hire_date: '2020-07-22' },
                    { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 92000, hire_date: '2019-01-10' },
                    { id: 4, name: 'David Brown', department: 'HR', salary: 58000, hire_date: '2022-05-01' },
                    { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 72000, hire_date: '2021-11-30' },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000, hire_date: '2021-03-15' },
                { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000, hire_date: '2020-07-22' },
                { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 92000, hire_date: '2019-01-10' },
                { id: 4, name: 'David Brown', department: 'HR', salary: 58000, hire_date: '2022-05-01' },
                { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 72000, hire_date: '2021-11-30' },
            ],
        },
    },
    {
        title: 'Filter with WHERE Clause',
        description: 'Practice filtering records using conditions with the WHERE clause.',
        difficulty: 'Easy',
        question: 'Write a SQL query to find all employees who work in the "Engineering" department.',
        tags: ['WHERE', 'Filter', 'Basic'],
        sampleTables: [
            {
                tableName: 'employees',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'department', dataType: 'TEXT' },
                    { columnName: 'salary', dataType: 'REAL' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
                    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
                    { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 92000 },
                    { id: 4, name: 'David Brown', department: 'HR', salary: 58000 },
                    { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 72000 },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
                { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 92000 },
            ],
        },
    },
    {
        title: 'Aggregate Functions - COUNT & AVG',
        description: 'Use aggregate functions to compute counts and averages.',
        difficulty: 'Medium',
        question: 'Write a SQL query to find the number of employees in each department and their average salary. Order the results by department name alphabetically.',
        tags: ['GROUP BY', 'COUNT', 'AVG', 'Aggregate'],
        sampleTables: [
            {
                tableName: 'employees',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'department', dataType: 'TEXT' },
                    { columnName: 'salary', dataType: 'REAL' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
                    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
                    { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 92000 },
                    { id: 4, name: 'David Brown', department: 'HR', salary: 58000 },
                    { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 72000 },
                    { id: 6, name: 'Frank Chen', department: 'Engineering', salary: 95000 },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { department: 'Engineering', employee_count: 3, avg_salary: 90666.67 },
                { department: 'HR', employee_count: 1, avg_salary: 58000 },
                { department: 'Marketing', employee_count: 2, avg_salary: 68500 },
            ],
        },
    },
    {
        title: 'JOIN - Combining Two Tables',
        description: 'Learn to combine data from multiple tables using INNER JOIN.',
        difficulty: 'Medium',
        question: 'Write a SQL query to get a list of all orders, including the customer name and the product name for each order. Show: customer name, product name, quantity, and order date.',
        tags: ['JOIN', 'INNER JOIN', 'Relations'],
        sampleTables: [
            {
                tableName: 'customers',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'email', dataType: 'TEXT' },
                ],
                rows: [
                    { id: 1, name: 'Alice Green', email: 'alice@example.com' },
                    { id: 2, name: 'Bob Blue', email: 'bob@example.com' },
                    { id: 3, name: 'Carol Red', email: 'carol@example.com' },
                ],
            },
            {
                tableName: 'products',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'price', dataType: 'REAL' },
                ],
                rows: [
                    { id: 1, name: 'Laptop', price: 999.99 },
                    { id: 2, name: 'Mouse', price: 29.99 },
                    { id: 3, name: 'Keyboard', price: 79.99 },
                ],
            },
            {
                tableName: 'orders',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'customer_id', dataType: 'INTEGER' },
                    { columnName: 'product_id', dataType: 'INTEGER' },
                    { columnName: 'quantity', dataType: 'INTEGER' },
                    { columnName: 'order_date', dataType: 'TEXT' },
                ],
                rows: [
                    { id: 1, customer_id: 1, product_id: 1, quantity: 1, order_date: '2024-01-15' },
                    { id: 2, customer_id: 2, product_id: 2, quantity: 3, order_date: '2024-01-18' },
                    { id: 3, customer_id: 1, product_id: 3, quantity: 2, order_date: '2024-02-01' },
                    { id: 4, customer_id: 3, product_id: 1, quantity: 1, order_date: '2024-02-10' },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { customer_name: 'Alice Green', product_name: 'Laptop', quantity: 1, order_date: '2024-01-15' },
                { customer_name: 'Bob Blue', product_name: 'Mouse', quantity: 3, order_date: '2024-01-18' },
                { customer_name: 'Alice Green', product_name: 'Keyboard', quantity: 2, order_date: '2024-02-01' },
                { customer_name: 'Carol Red', product_name: 'Laptop', quantity: 1, order_date: '2024-02-10' },
            ],
        },
    },
    {
        title: 'Subquery Challenge',
        description: 'Master subqueries to filter data based on aggregated conditions.',
        difficulty: 'Hard',
        question: 'Write a SQL query to find all employees who earn more than the average salary of their own department. Return employee name, department, salary, and round the department average salary to 2 decimal places.',
        tags: ['Subquery', 'AVG', 'Correlated', 'Advanced'],
        sampleTables: [
            {
                tableName: 'employees',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'department', dataType: 'TEXT' },
                    { columnName: 'salary', dataType: 'REAL' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
                    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
                    { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 95000 },
                    { id: 4, name: 'David Brown', department: 'HR', salary: 58000 },
                    { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 78000 },
                    { id: 6, name: 'Frank Chen', department: 'Engineering', salary: 75000 },
                    { id: 7, name: 'Grace Kim', department: 'HR', salary: 62000 },
                    { id: 8, name: 'Henry Park', department: 'Marketing', salary: 55000 },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { name: 'Carol Williams', department: 'Engineering', salary: 95000, dept_avg_salary: 85000 },
                { name: 'Eva Martinez', department: 'Marketing', salary: 78000, dept_avg_salary: 66000 },
                { name: 'Grace Kim', department: 'HR', salary: 62000, dept_avg_salary: 60000 },
            ],
        },
    },
    {
        title: 'Window Functions & Ranking',
        description: 'Explore advanced SQL with window functions to rank and partition data.',
        difficulty: 'Hard',
        question: 'Write a SQL query to rank employees within each department by their salary in descending order. Return employee name, department, salary, and their rank within the department. Use RANK() window function.',
        tags: ['Window Functions', 'RANK', 'PARTITION BY', 'Advanced'],
        sampleTables: [
            {
                tableName: 'employees',
                columns: [
                    { columnName: 'id', dataType: 'INTEGER' },
                    { columnName: 'name', dataType: 'TEXT' },
                    { columnName: 'department', dataType: 'TEXT' },
                    { columnName: 'salary', dataType: 'REAL' },
                ],
                rows: [
                    { id: 1, name: 'Alice Johnson', department: 'Engineering', salary: 85000 },
                    { id: 2, name: 'Bob Smith', department: 'Marketing', salary: 65000 },
                    { id: 3, name: 'Carol Williams', department: 'Engineering', salary: 95000 },
                    { id: 4, name: 'David Brown', department: 'HR', salary: 58000 },
                    { id: 5, name: 'Eva Martinez', department: 'Marketing', salary: 78000 },
                    { id: 6, name: 'Frank Chen', department: 'Engineering', salary: 75000 },
                    { id: 7, name: 'Grace Kim', department: 'HR', salary: 62000 },
                ],
            },
        ],
        expectedOutput: {
            type: 'table',
            value: [
                { name: 'Carol Williams', department: 'Engineering', salary: 95000, dept_rank: 1 },
                { name: 'Alice Johnson', department: 'Engineering', salary: 85000, dept_rank: 2 },
                { name: 'Frank Chen', department: 'Engineering', salary: 75000, dept_rank: 3 },
                { name: 'Grace Kim', department: 'HR', salary: 62000, dept_rank: 1 },
                { name: 'David Brown', department: 'HR', salary: 58000, dept_rank: 2 },
                { name: 'Eva Martinez', department: 'Marketing', salary: 78000, dept_rank: 1 },
                { name: 'Bob Smith', department: 'Marketing', salary: 65000, dept_rank: 2 },
            ],
        },
    },
];

const seedAssignments = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected');

        // Clear existing assignments
        await Assignment.deleteMany({});
        console.log('🗑️  Cleared existing assignments');

        // Insert new assignments
        const result = await Assignment.insertMany(assignments);
        console.log(`✅ Seeded ${result.length} assignments successfully`);

        result.forEach((a, i) => {
            console.log(`   ${i + 1}. [${a.difficulty}] ${a.title} (ID: ${a._id})`);
        });

        await mongoose.disconnect();
        console.log('\n🎉 Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
        process.exit(1);
    }
};

seedAssignments();
