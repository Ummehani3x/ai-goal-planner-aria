const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// 1. Submit Goal -> Get Clarification Questions
router.post('/goal', async (req, res) => {
    try {
        const { goal } = req.body;
        if (!goal) return res.status(400).json({ error: 'Goal text is required' });
        const questions = await aiService.generateClarifications(goal);
        res.json({ questions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate clarifications' });
    }
});

// 2. Generate Strategy (AI-FIRST MODE: Stateless)
router.post('/strategy/generate', async (req, res) => {
    try {
        const { goal, answers } = req.body;

        // Input validation
        if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
            console.error("[API] ❌ Invalid goal input:", goal);
            return res.status(400).json({ error: 'Valid goal text is required' });
        }

        console.log("[API] ========== STRATEGY GENERATION START ==========");
        console.log("[API] Goal:", goal);
        console.log("[API] Answers provided:", answers?.length || 0);

        // Pure Gemini generation - no IDs, no persistence
        console.log("[API] Calling Gemini AI...");
        const strategyData = await aiService.generatePlan(goal, answers || []);

        // Validate Gemini response
        if (!strategyData) {
            console.error("[API] ❌ Gemini returned null/undefined");
            throw new Error("AI service returned no data");
        }

        if (!strategyData.steps || !Array.isArray(strategyData.steps) || strategyData.steps.length === 0) {
            console.error("[API] ❌ Invalid strategy structure:", JSON.stringify(strategyData, null, 2));
            throw new Error("AI service returned invalid strategy structure");
        }

        console.log("[API] ✓ Gemini response received");
        console.log("[API] ✓ Strategy title:", strategyData.title || goal);
        console.log("[API] ✓ Steps count:", strategyData.steps.length);

        // Add goal to response
        const response = {
            ...strategyData,
            goal
        };

        console.log("[API] ========== STRATEGY GENERATION SUCCESS ==========");
        res.json(response);
    } catch (error) {
        console.error("[API] ========== STRATEGY GENERATION FAILED ==========");
        console.error("[API] Error type:", error.name);
        console.error("[API] Error message:", error.message);
        console.error("[API] Full error:", error);

        res.status(500).json({
            error: 'Failed to generate strategy',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// 3. Aria Guidance Endpoints (STATELESS - Direct Gemini calls)
router.post('/aria/explain', async (req, res) => {
    try {
        const { stepTitle, stepDescription } = req.body;

        if (!stepTitle) {
            return res.status(400).json({ error: 'Step title is required' });
        }

        console.log("[API] Aria explaining:", stepTitle);

        const explanation = await aiService.explainStep(stepTitle, stepDescription);
        res.json({ explanation });
    } catch (error) {
        console.error("[API] Explain failed:", error);
        res.status(500).json({
            explanation: "I'm here to help, but having a momentary connection issue. Try again in a moment."
        });
    }
});

router.post('/aria/improve', async (req, res) => {
    try {
        const { stepTitle, stepDescription } = req.body;

        if (!stepTitle) {
            return res.status(400).json({ error: 'Step title is required' });
        }

        console.log("[API] Aria improving:", stepTitle);

        const suggestion = await aiService.improveStep(stepTitle, stepDescription);
        res.json({ suggestion });
    } catch (error) {
        console.error("[API] Improve failed:", error);
        res.status(500).json({
            suggestion: "I'm here to help, but having a momentary connection issue. Try again in a moment."
        });
    }
});

router.post('/aria/ask', async (req, res) => {
    try {
        const { question, stepTitle } = req.body;

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        console.log("[API] Aria answering:", question);

        const answer = await aiService.askAria(question, stepTitle);
        res.json({ answer });
    } catch (error) {
        console.error("[API] Ask failed:", error);
        res.status(500).json({
            answer: "I'm here to help, but having a momentary connection issue. Try again in a moment."
        });
    }
});

router.post('/aria/next', async (req, res) => {
    try {
        const { stepTitle, stepDescription } = req.body;

        if (!stepTitle) {
            return res.status(400).json({ error: 'Step title is required' });
        }

        console.log("[API] Aria providing next move for:", stepTitle);

        const nextMove = await aiService.getNextMove(stepTitle, stepDescription);
        res.json({ message: nextMove });
    } catch (error) {
        console.error("[API] Next move failed:", error);
        res.status(500).json({
            message: "Pause for a moment. Your current step is enough—progress comes from consistency."
        });
    }
});

module.exports = router;
