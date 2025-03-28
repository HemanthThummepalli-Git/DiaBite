const mongoose = require("mongoose");


const sugarLevelsSchema = new mongoose.Schema({
    mealType: { type: String, required: true, default: "initial" },
    fastingSugarLevel: { type: Number, required: true, default: -1 },
    preMealSugarLevel: { type: Number, required: true, default: -1 },
    postMealSugarLevel: { type: Number, required: true, default: -1 },
    date: { type: Date, required: true }
}, { _id: false }); 


const foodLogSchema = new mongoose.Schema({
    mealType: { type: String, required: true }, // e.g., Breakfast, Lunch, Dinner
    foodItems: [
        {
            foodName: String,
            brandName: String,
            servingQty: Number,  
            servingUnit: String,
            servingWeightGrams: Number,
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number,
            fiber: Number,
            sugar: Number,
            sodium: Number,
            potassium: Number,
            phosphorus: Number,
            fullNutrients: Object,
            photo: String
        }
    ],
    inputMethod: { type: String, enum: ["text", "voice"], default: "text" },
    totalCalories: Number,
    totalProtein: Number,
    totalCarbs: Number,
    totalFats: Number,
    dateLogged: { type: Date, default: Date.now }
}, { _id: false }); 

// Updated User Schema
const userSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true }, 
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    diabetesType: { type: String, required: true },
    sugarLevels: { type: [sugarLevelsSchema], default: [] },  
    dietaryPreference: { type: String, required: true },  
    dailyCaloricIntake: { type: Number, required: true },  
    foodAllergies: { type: [String], default: [] },  
    mealTypePreference: { type: String },  
    activityLevel: { type: String },  
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    foodLogs: { type: [foodLogSchema], default: [] } 
});

const User = mongoose.model("User", userSchema);

module.exports = User;
