const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_MOCK_KEY");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateClarifications = async (goalText) => {
    try {
        const prompt = `You are Aria, an expert Strategy Architect.
        Ask 3-5 short, conversational clarifying questions to make this goal actionable: "${goalText}". 
        
        Questions should feel like a coaching session (e.g., "Got it. To start, what's your target timeline for this?").
        Return ONLY a JSON array of strings.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Basic JSON extraction
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return ["What is your timeline?", "What is your current experience level?", "Do you have any constraints?"];
    } catch (error) {
        console.error("AI Clarification Error:", error);
        return ["What is your target timeline?", "What resources do you have available?", "What is your primary motivation?"];
    }
};

const generatePlan = async (goalText, clarifications) => {
    console.log("[AI Service] ========== GEMINI GENERATION START ==========");
    console.log("[AI Service] Goal:", goalText);
    console.log("[AI Service] Clarifications:", clarifications.length);

    try {
        const clarificationSummary = clarifications.map(c => `- Q: ${c.question} A: ${c.answer}`).join('\n');
        const prompt = `You are Aria, an expert Strategy Architect and AI coach.

User Goal: "${goalText}"
${clarifications.length > 0 ? `Clarifications: ${clarificationSummary}` : ''}

Create a comprehensive, GUIDANCE-FOCUSED strategy that feels like a personal coach.

You MUST return ONLY valid JSON in this exact format:
{
  "title": "Clear, inspiring strategy title",
  "overview": "A warm, motivating overview from Aria explaining the approach and why it will work (2-3 sentences)",
  "steps": [
    {
      "id": "1",
      "title": "Phase 1 — Foundation",
      "description": "Detailed description of what to do in this phase. Focus on ACTIONABLE steps, not vague advice.",
      "tips": "WHY this phase matters, what success looks like, and common mistakes to avoid. Make this conversational and insightful."
    }
  ]
}

CRITICAL REQUIREMENTS:
- Each step MUST explain WHY it matters, not just WHAT to do
- Include "what success looks like" in tips
- Mention common mistakes or pitfalls
- Use phases (Foundation, Growth, Mastery) instead of generic "Step 1, Step 2"
- Make it feel like a human coach is guiding them
- Be specific and actionable, never vague
- 4-6 steps maximum for focus

Do not include markdown formatting or backticks.`;

        console.log("[AI Service] Sending request to Gemini...");
        console.log("[AI Service] Prompt length:", prompt.length, "characters");

        const result = await model.generateContent(prompt);

        if (!result) {
            console.error("[AI Service] ❌ Gemini returned null result");
            throw new Error("Gemini API returned null");
        }

        console.log("[AI Service] ✓ Gemini responded");

        const response = await result.response;

        if (!response) {
            console.error("[AI Service] ❌ No response object from Gemini");
            throw new Error("No response from Gemini");
        }

        const text = response.text();
        console.log("[AI Service] ✓ Response text received, length:", text.length);
        console.log("[AI Service] Raw response preview:", text.substring(0, 200) + "...");

        const cleanedText = text.replace(/```json|```/g, "").trim();
        console.log("[AI Service] ✓ Cleaned text, attempting JSON parse...");

        const parsedData = JSON.parse(cleanedText);

        console.log("[AI Service] ✓ JSON parsed successfully");
        console.log("[AI Service] ✓ Title:", parsedData.title);
        console.log("[AI Service] ✓ Steps count:", parsedData.steps?.length);
        console.log("[AI Service] ========== GEMINI GENERATION SUCCESS ==========");

        return parsedData;
    } catch (error) {
        console.error("[AI Service] ========== GEMINI GENERATION FAILED ==========");
        console.error("[AI Service] Error type:", error.name);
        console.error("[AI Service] Error message:", error.message);

        if (error instanceof SyntaxError) {
            console.error("[AI Service] ❌ JSON Parse Error - Gemini returned invalid JSON");
        }

        console.log("[AI Service] Falling back to default strategy...");

        return {
            title: `Strategy for: ${goalText}`,
            overview: "I've designed a focused approach to help you achieve this goal with clarity and momentum.",
            steps: [
                {
                    id: "1",
                    title: "Phase 1 — Foundation",
                    description: "Break down the main goal into smaller, measurable objectives using the SMART framework.",
                    tips: "Why this matters: Without clear markers of success, you'll lose momentum early on. Success looks like having 3-5 specific, measurable outcomes defined. Common mistake: Making goals too vague or too ambitious."
                },
                {
                    id: "2",
                    title: "Phase 2 — Resource Gathering",
                    description: "Identify and bookmark the tools, tutorials, and information needed to achieve each objective.",
                    tips: "Why this matters: Efficiency comes from using the right tools for the job. Success looks like having a curated list of 5-10 high-quality resources. Common mistake: Information overload—focus on quality over quantity."
                },
                {
                    id: "3",
                    title: "Phase 3 — Execution & Iteration",
                    description: "Start with the first objective and iterate based on feedback and results.",
                    tips: "Why this matters: Action beats planning every time. Success looks like completing your first milestone within 1-2 weeks. Common mistake: Perfectionism—ship early, improve later."
                }
            ]
        };
    }
};

const regenerateStep = async (step, context) => {
    try {
        const prompt = `Rewrite ONLY this step to be simpler and more beginner-friendly without changing the overall plan.
        Current Step: ${JSON.stringify(step)}
        Goal Context: ${context}

        Return ONLY a JSON object for the single step.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const jsonMatch = text.match(/\{.*\}/s);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return step;
    } catch (error) {
        console.error("AI Step Regeneration Error:", error);
        return step;
    }
};

// PHASE 1: Stateless AI guidance functions
const explainStep = async (stepTitle, stepDescription) => {
    try {
        const prompt = `You are Aria, an expert Strategy Architect and coach.

The user is working on this phase: "${stepTitle}"
Description: ${stepDescription || 'No additional details'}

Explain this phase in detail. Give them:
1. WHY this phase is critical to their success
2. Specific, actionable implementation advice
3. Common pitfalls to avoid
4. What success looks like at this stage

Keep it conversational, motivating, and under 150 words.
Speak like a calm execution coach, not an assistant.`;

        console.log("[AI Service] Explaining step:", stepTitle);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const explanation = response.text();

        console.log("[AI Service] ✓ Explanation generated");
        return explanation;
    } catch (error) {
        console.error("[AI Service] Explain error:", error);
        return "This phase is crucial for building momentum. Focus on taking the first actionable step today—consistency beats perfection.";
    }
};

const improveStep = async (stepTitle, stepDescription) => {
    try {
        const prompt = `You are Aria, an expert Strategy Architect and coach.

The user is working on this phase: "${stepTitle}"
Description: ${stepDescription || 'No additional details'}

Suggest 2-3 specific ways to optimize or improve this phase. Focus on:
1. Making it more efficient
2. Reducing friction or obstacles
3. Increasing chances of success

Be specific and actionable. Keep it under 120 words.
Speak like a calm execution coach, not an assistant.`;

        console.log("[AI Service] Improving step:", stepTitle);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const suggestion = response.text();

        console.log("[AI Service] ✓ Improvement generated");
        return suggestion;
    } catch (error) {
        console.error("[AI Service] Improve error:", error);
        return "Consider breaking this phase into smaller daily tasks. Set a specific time each day to work on it. Track your progress visually—it builds momentum.";
    }
};

const askAria = async (question, stepTitle) => {
    try {
        const prompt = `You are Aria, an expert Strategy Architect and motivational coach.

The user is working on: "${stepTitle || 'their goal'}"
Their question: "${question}"

Provide a motivating, insightful, and practical answer. 
If they ask "What should I do next?", give them a very specific, high-momentum task.
Be conversational and supportive. Keep it under 100 words.`;

        console.log("[AI Service] Answering question:", question);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const answer = response.text();

        console.log("[AI Service] ✓ Answer generated");
        return answer;
    } catch (error) {
        console.error("[AI Service] Ask error:", error);
        return "I'm here to help, but having a momentary connection issue. Focus on your immediate task for now—consistency is key!";
    }
};

const getNextMove = async (stepTitle, stepDescription) => {
    try {
        const prompt = `You are Aria, an AI execution coach.

Current phase: "${stepTitle}"
Description: ${stepDescription || 'No details'}

Give ONE clear next action:
• Short (1-2 sentences)
• Practical and actionable TODAY
• Encouraging
• Specific to this phase

Keep it under 80 words.
Speak like a calm execution coach, not an assistant.`;

        console.log("[AI Service] Getting next move for:", stepTitle);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const nextMove = response.text();

        console.log("[AI Service] ✓ Next move generated");
        return nextMove;
    } catch (error) {
        console.error("[AI Service] Next move error:", error);
        return "Focus on completing the current phase with consistency. Small daily actions compound into major results.";
    }
};

module.exports = {
    generateClarifications,
    generatePlan,
    regenerateStep,
    explainStep,
    improveStep,
    askAria,
    getNextMove
};
