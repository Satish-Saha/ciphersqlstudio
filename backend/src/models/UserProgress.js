const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    sqlQuery: { type: String, default: '' },
    isCompleted: { type: Boolean, default: false },
    attemptCount: { type: Number, default: 0 },
    lastAttempt: { type: Date, default: Date.now },
}, { timestamps: true });

userProgressSchema.index({ userId: 1, assignmentId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
