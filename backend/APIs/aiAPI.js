const express = require("express");
const AiApp = express.Router();
const User = require("../models/User");
require("dotenv").config();
const authMiddleware = require("../middlewares/authMiddlleware");

const { ChatPromptTemplate } = require("@langchain/core/prompts");
const { ChatGroq } = require("@langchain/groq");


// Initialize AI Model with Groq API
const model = new ChatGroq({
    apiKey: "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",
    model: "deepseek-r1-distill-llama-70b",
});

// AI Recommendation Route
AiApp.post("/ai-recommendations", authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user.id; // Extract user ID from auth middleware

        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({ error: "Prompt is required for recommendations" });
        }

        // Fetch user data from MongoDB
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Extract latest sugar level (if available)
        const sugarLevelsString = user.sugarLevels.length > 0
        ? user.sugarLevels
            .map(s => 
                `Date: ${s.date.toISOString().split('T')[0]}, ` +
                `MealType: ${s.mealType}, ` +
                `Fasting: ${s.fastingSugarLevel}, ` +
                `Pre-Meal: ${s.preMealSugarLevel}, ` +
                `Post-Meal: ${s.postMealSugarLevel}`
            ).join(" | ")  // Separate multiple entries with a pipe
        : "No recent data";

        // Extract last 3 food logs (if available)
        const foodLogsString = user.foodLogs.length > 0
        ? user.foodLogs.map(log => 
            log.foodItems.map(item => `${item.foodName} (${item.servingQty} ${item.servingUnit})`).join(", ")
          ).join(" | ")  // Separate meals with a pipe
        : "No recent food logs";
    

        // Compile user information
        const userInfo = {
            name: user.name,
            age: user.age,
            gender: user.gender,
            weight: user.weight,
            height: user.height,
            diabetesType: user.diabetesType,
            dietaryPreference: user.dietaryPreference || "None",
            activityLevel: user.activityLevel || "Unknown",
            foodAllergies: user.foodAllergies.length > 0 ? user.foodAllergies.join(", ") : "None",
            dailyCaloricIntake: user.dailyCaloricIntake,
            sugarLevelsString,
            foodLogsString
        };
        // Define AI prompt with user info
        const chatPrompt = ChatPromptTemplate.fromMessages([
            ["system", `Give the answer based on users query with info in the prompt given and give the answer in a short manner.DONT USE BIG HEADINGS IN RESPONSE`],
            ["system", `You are a health-focused AI providing personalized food recommendations based on user's diabetes condition.`],
            ["system", `User Info: Name: ${userInfo.name}, Age: ${userInfo.age}, Gender: ${userInfo.gender}, Weight: ${userInfo.weight}kg, Height: ${userInfo.height}cm, 
                        Diabetes Type: ${userInfo.diabetesType}, Dietary Preference: ${userInfo.dietaryPreference}, Activity Level: ${userInfo.activityLevel}, 
                        Food Allergies: ${userInfo.foodAllergies}, Daily Caloric Intake: ${userInfo.dailyCaloricIntake} kcal, 
                        Latest Sugar Level: ${userInfo.sugarLevelsString}, Recent Meals: ${userInfo.foodLogsString}`],
            ["human", "{input}"]
        ]);
        // Format prompt with user input
        const formattedPrompt = await chatPrompt.format({ input:prompt});
        console.log(formattedPrompt);

        // Generate AI response
        const response = await model.invoke(formattedPrompt);

        if (!response) {
            return res.status(500).json({ error: "Failed to generate recommendations" });
        }

        // Send AI-generated recommendation
        const cleanedResponse = response.content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
        console.log(cleanedResponse);
        res.json({ recommendation: cleanedResponse });

    } catch (error) {
        console.error("Error in AI recommendation route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = AiApp;
