const mongoose = require('mongoose');

const StepSchema = new mongoose.Schema({
    id: { type: String }, // For frontend mapping if needed
    title: { type: String, required: true },
    description: { type: String, required: true },
    tips: { type: String }, // Renamed from how/why to tips per request
    duration: { type: String },
    priority: { type: String },
});

const PlanSchema = new mongoose.Schema({
    strategyId: { type: String, unique: true }, // Formal ID
    title: { type: String, required: true },
    overview: { type: String }, // Renamed from ariaInsight
    steps: [StepSchema],
    goal: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plan', PlanSchema);
