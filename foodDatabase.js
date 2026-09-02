// Server-side copy of the food database, used for matching Vision API labels
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

module.exports = FOOD_DATABASE;