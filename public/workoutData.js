// Two real weekly split templates, chosen based on fitness level (rule-based, not random)
const WEEKLY_TEMPLATES = {
  "Full Body": [
    { day: "Monday", icon: "🔥", name: "Full Body A", muscles: ["Chest", "Back", "Quads", "Core"], rest: false },
    { day: "Tuesday", icon: "🧘", name: "Active Recovery", muscles: [], rest: true, note: "Recovery day — stretch, walk, sleep well." },
    { day: "Wednesday", icon: "💪", name: "Full Body B", muscles: ["Shoulders", "Back", "Hamstrings", "Glutes"], rest: false },
    { day: "Thursday", icon: "😴", name: "Rest Day", muscles: [], rest: true, note: "Recovery day — stretch, walk, sleep well." },
    { day: "Friday", icon: "🏋️", name: "Full Body C", muscles: ["Chest", "Biceps", "Triceps", "Quads"], rest: false },
    { day: "Saturday", icon: "⚡", name: "Conditioning", muscles: ["Full Body"], rest: false, note: "HIIT Full Body" },
    { day: "Sunday", icon: "😴", name: "Rest Day", muscles: [], rest: true, note: "Recovery day — stretch, walk, sleep well." }
  ],
  "Push Pull Legs": [
    { day: "Monday", icon: "🔥", name: "Push Day A", muscles: ["Chest", "Shoulders", "Triceps"], rest: false },
    { day: "Tuesday", icon: "💪", name: "Pull Day A", muscles: ["Back", "Biceps"], rest: false },
    { day: "Wednesday", icon: "🦵", name: "Leg Day A", muscles: ["Quads", "Hamstrings", "Glutes", "Calves"], rest: false },
    { day: "Thursday", icon: "😴", name: "Rest Day", muscles: [], rest: true, note: "Recovery day — stretch, walk, sleep well." },
    { day: "Friday", icon: "🔥", name: "Push Day B", muscles: ["Chest", "Shoulders", "Triceps"], rest: false },
    { day: "Saturday", icon: "💪", name: "Pull Day B", muscles: ["Back", "Biceps"], rest: false },
    { day: "Sunday", icon: "😴", name: "Rest Day", muscles: [], rest: true, note: "Recovery day — stretch, walk, sleep well." }
  ]
};

// Real exercise programming: sets x reps and rest times follow standard strength-training guidelines
const EXERCISE_LIBRARY = [
  // CHEST
  { name: "Barbell Bench Press", muscles: ["Chest", "Triceps", "Shoulders"], difficulty: "Intermediate", sets: 4, reps: "6-8", restSeconds: 120, howTo: "Lie on a flat bench, grip the bar slightly wider than shoulders, lower to chest with control, press up fully extending arms." },
  { name: "Incline Dumbbell Press", muscles: ["Chest", "Shoulders"], difficulty: "Beginner", sets: 4, reps: "8-10", restSeconds: 90, howTo: "On an incline bench, press dumbbells up and slightly inward, control the descent." },
  { name: "Push-Up", muscles: ["Chest", "Triceps", "Core"], difficulty: "Beginner", sets: 3, reps: "12-20", restSeconds: 60, howTo: "Keep body in a straight line, lower chest to just above the floor, push back up." },
  { name: "Cable Chest Fly", muscles: ["Chest"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Stand between cables, bring handles together in front of chest with a slight bend in the elbows." },
  // BACK
  { name: "Pull-Up", muscles: ["Back", "Biceps"], difficulty: "Intermediate", sets: 4, reps: "6-10", restSeconds: 120, howTo: "Hang from a bar, pull chin above the bar, lower with control." },
  { name: "Bent-Over Barbell Row", muscles: ["Back", "Biceps"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "Hinge at hips, keep back flat, pull the bar to your lower ribs." },
  { name: "Lat Pulldown", muscles: ["Back", "Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 75, howTo: "Pull the bar down to upper chest, squeeze shoulder blades together." },
  // SHOULDERS
  { name: "Overhead Press", muscles: ["Shoulders", "Triceps"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 90, howTo: "Press the bar or dumbbells overhead, keep core braced, avoid arching the lower back." },
  { name: "Lateral Raise", muscles: ["Shoulders"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Raise dumbbells out to the sides to shoulder height, slight bend in elbows." },
  // BICEPS
  { name: "Barbell Bicep Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Curl the bar up keeping elbows fixed at your sides, control the descent." },
  { name: "Hammer Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Curl dumbbells with a neutral grip, keep elbows still." },
  // TRICEPS
  { name: "Tricep Dips", muscles: ["Triceps", "Chest"], difficulty: "Intermediate", sets: 3, reps: "10-12", restSeconds: 75, howTo: "Lower body by bending elbows to ~90 degrees, press back up." },
  { name: "Tricep Rope Pushdown", muscles: ["Triceps"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Push the rope down and apart, keep elbows pinned to your sides." },
  // QUADS
  { name: "Barbell Back Squat", muscles: ["Quads", "Glutes", "Core"], difficulty: "Intermediate", sets: 4, reps: "6-8", restSeconds: 150, howTo: "Bar on upper back, sit hips back and down, keep chest up, drive through heels to stand." },
  { name: "Leg Press", muscles: ["Quads", "Glutes"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 90, howTo: "Press the platform away, don't lock knees fully, control the return." },
  { name: "Walking Lunges", muscles: ["Quads", "Glutes"], difficulty: "Beginner", sets: 3, reps: "12 each leg", restSeconds: 75, howTo: "Step forward into a lunge, keep front knee over ankle, alternate legs." },
  // HAMSTRINGS
  { name: "Romanian Deadlift", muscles: ["Hamstrings", "Glutes", "Back"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 100, howTo: "Hinge at hips keeping legs mostly straight, lower bar along shins, feel the hamstring stretch." },
  { name: "Leg Curl", muscles: ["Hamstrings"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Curl the pad toward your glutes, control the negative." },
  // GLUTES
  { name: "Hip Thrust", muscles: ["Glutes", "Hamstrings"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 90, howTo: "Upper back on a bench, drive hips up, squeeze glutes at the top." },
  // CORE
  { name: "Plank", muscles: ["Core"], difficulty: "Beginner", sets: 3, reps: "30-60 sec", restSeconds: 45, howTo: "Keep body in a straight line from head to heels, brace your core." },
  { name: "Hanging Leg Raise", muscles: ["Core"], difficulty: "Intermediate", sets: 3, reps: "10-15", restSeconds: 60, howTo: "Hang from a bar, raise legs to hip height or above, control the descent." },
  // CALVES
  { name: "Standing Calf Raise", muscles: ["Calves"], difficulty: "Beginner", sets: 4, reps: "15-20", restSeconds: 45, howTo: "Rise onto your toes as high as possible, pause, lower with control." },
  // FULL BODY / CONDITIONING
  { name: "Burpees", muscles: ["Full Body"], difficulty: "Intermediate", sets: 4, reps: "12-15", restSeconds: 45, howTo: "Drop to a push-up, jump feet in, then jump up explosively." },
  { name: "Kettlebell Swing", muscles: ["Full Body", "Glutes", "Core"], difficulty: "Intermediate", sets: 4, reps: "15-20", restSeconds: 60, howTo: "Hinge at hips, swing the kettlebell to shoulder height using hip power, not arms." },
  { name: "Mountain Climbers", muscles: ["Full Body", "Core"], difficulty: "Beginner", sets: 3, reps: "30 sec", restSeconds: 30, howTo: "In a plank position, drive knees toward chest alternately at a fast pace." }
];

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Core", "Calves", "Full Body"];