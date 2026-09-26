// Client-side copy of the food database (browser global, not a Node module)
const FOOD_DATABASE = [
  { name: "Chicken breast (cooked)", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: "Brown rice (cooked)", calories: 123, protein: 2.7, carbs: 26, fat: 1 },
  { name: "White rice (cooked)", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Eggs", calories: 155, protein: 13, carbs: 1.1, fat: 11 },
  { name: "Oats", calories: 389, protein: 17, carbs: 66, fat: 7 },
  { name: "Banana", calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
  { name: "Greek yogurt", calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: "Almonds", calories: 579, protein: 21, carbs: 22, fat: 50 },
  { name: "Broccoli", calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: "Salmon (cooked)", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: "Sweet potato", calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  { name: "Paneer", calories: 265, protein: 18, carbs: 3.6, fat: 20 },
  { name: "Dal (cooked)", calories: 116, protein: 9, carbs: 20, fat: 0.4 },
  { name: "Roti/Chapati", calories: 297, protein: 11, carbs: 59, fat: 3.7 },
  { name: "Milk", calories: 42, protein: 3.4, carbs: 5, fat: 1 },
  { name: "Peanut butter", calories: 588, protein: 25, carbs: 20, fat: 50 },
  { name: "Whey protein powder", calories: 400, protein: 80, carbs: 8, fat: 5 },
  { name: "Apple", calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
  { name: "Whole wheat bread", calories: 247, protein: 13, carbs: 41, fat: 3.4 },
  { name: "Spinach", calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4 },
  { name: "Rice", calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
  { name: "Curry", calories: 150, protein: 8, carbs: 12, fat: 8 },
  { name: "Vegetable", calories: 40, protein: 2, carbs: 8, fat: 0.3 },
  { name: "Bread", calories: 265, protein: 9, carbs: 49, fat: 3.2 },
  { name: "Cheese", calories: 402, protein: 25, carbs: 1.3, fat: 33 }
];

// Diet Plan tab meal options — each slot has 4 swappable alternatives
const MEAL_TEMPLATES = {
  Breakfast: [
    { name: "Protein oats with berries", calories: 420, protein: 28, carbs: 55, fat: 10 },
    { name: "Egg omelette with whole wheat toast", calories: 380, protein: 26, carbs: 30, fat: 16 },
    { name: "Greek yogurt with almonds and banana", calories: 350, protein: 22, carbs: 35, fat: 14 },
    { name: "Paneer paratha with curd", calories: 450, protein: 20, carbs: 48, fat: 18 }
  ],
  Lunch: [
    { name: "Chicken rice bowl", calories: 620, protein: 45, carbs: 65, fat: 16 },
    { name: "Dal, rice and vegetable curry", calories: 540, protein: 22, carbs: 80, fat: 12 },
    { name: "Grilled salmon with sweet potato", calories: 580, protein: 38, carbs: 45, fat: 22 },
    { name: "Paneer curry with roti", calories: 560, protein: 26, carbs: 60, fat: 20 }
  ],
  Snack: [
    { name: "Yogurt fruit bowl", calories: 220, protein: 12, carbs: 30, fat: 6 },
    { name: "Whey protein shake with banana", calories: 260, protein: 30, carbs: 28, fat: 4 },
    { name: "Almonds and an apple", calories: 240, protein: 7, carbs: 25, fat: 14 },
    { name: "Peanut butter on whole wheat toast", calories: 300, protein: 12, carbs: 28, fat: 16 }
  ],
  Dinner: [
    { name: "Salmon with roasted potatoes and vegetables", calories: 560, protein: 36, carbs: 40, fat: 24 },
    { name: "Chicken breast with broccoli and rice", calories: 500, protein: 42, carbs: 45, fat: 10 },
    { name: "Dal and roti with spinach curry", calories: 460, protein: 20, carbs: 65, fat: 10 },
    { name: "Paneer stir-fry with vegetables", calories: 480, protein: 24, carbs: 35, fat: 22 }
  ]
};