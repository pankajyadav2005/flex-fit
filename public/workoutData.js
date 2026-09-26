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
  // ===== CHEST =====
  { name: "Barbell Bench Press", muscles: ["Chest", "Triceps", "Shoulders"], difficulty: "Intermediate", sets: 4, reps: "6-8", restSeconds: 120, howTo: "Lie on a flat bench, grip the bar slightly wider than shoulders, lower to chest with control, press up fully extending arms." },
  { name: "Incline Dumbbell Press", muscles: ["Chest", "Shoulders"], difficulty: "Beginner", sets: 4, reps: "8-10", restSeconds: 90, howTo: "On an incline bench, press dumbbells up and slightly inward, control the descent." },
  { name: "Push-Up", muscles: ["Chest", "Triceps", "Core"], difficulty: "Beginner", sets: 3, reps: "12-20", restSeconds: 60, howTo: "Keep body in a straight line, lower chest to just above the floor, push back up." },
  { name: "Cable Chest Fly", muscles: ["Chest"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Stand between cables, bring handles together in front of chest with a slight bend in the elbows." },
  { name: "Dumbbell Chest Press", muscles: ["Chest", "Triceps"], difficulty: "Beginner", sets: 4, reps: "8-12", restSeconds: 90, howTo: "Lie flat, press dumbbells straight up over the chest, lower with control until elbows are level with the bench." },
  { name: "Decline Barbell Press", muscles: ["Chest", "Triceps"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "On a decline bench, lower the bar to the lower chest, press up in a straight line." },
  { name: "Pec Deck Machine", muscles: ["Chest"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Sit tall, bring the pads together in front of your chest, squeeze at the peak, control the return." },
  { name: "Weighted Dip", muscles: ["Chest", "Triceps"], difficulty: "Advanced", sets: 3, reps: "6-10", restSeconds: 120, howTo: "Add weight via a belt or vest, lean slightly forward, lower until shoulders are below elbows, press back up." },

  // ===== BACK =====
  { name: "Pull-Up", muscles: ["Back", "Biceps"], difficulty: "Intermediate", sets: 4, reps: "6-10", restSeconds: 120, howTo: "Hang from a bar, pull chin above the bar, lower with control." },
  { name: "Bent-Over Barbell Row", muscles: ["Back", "Biceps"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "Hinge at hips, keep back flat, pull the bar to your lower ribs." },
  { name: "Lat Pulldown", muscles: ["Back", "Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 75, howTo: "Pull the bar down to upper chest, squeeze shoulder blades together." },
  { name: "Seated Cable Row", muscles: ["Back", "Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 75, howTo: "Sit tall, pull the handle to your midsection, squeeze shoulder blades, control the return." },
  { name: "Single-Arm Dumbbell Row", muscles: ["Back", "Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Support yourself on a bench, row the dumbbell to your hip, keep your torso still." },
  { name: "Deadlift", muscles: ["Back", "Hamstrings", "Glutes"], difficulty: "Advanced", sets: 4, reps: "5-6", restSeconds: 150, howTo: "Hinge at the hips with a flat back, grip the bar, drive through your heels to stand tall, keeping the bar close to your body." },
  { name: "T-Bar Row", muscles: ["Back", "Biceps"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "Hinge forward, pull the handle to your chest, squeeze your back at the top." },

  // ===== SHOULDERS =====
  { name: "Overhead Press", muscles: ["Shoulders", "Triceps"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 90, howTo: "Press the bar or dumbbells overhead, keep core braced, avoid arching the lower back." },
  { name: "Lateral Raise", muscles: ["Shoulders"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Raise dumbbells out to the sides to shoulder height, slight bend in elbows." },
  { name: "Face Pull", muscles: ["Shoulders", "Back"], difficulty: "Beginner", sets: 3, reps: "15-20", restSeconds: 45, howTo: "Pull the rope toward your face, flaring elbows out wide, squeeze your rear delts." },
  { name: "Arnold Press", muscles: ["Shoulders", "Triceps"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 75, howTo: "Start with palms facing you, rotate as you press overhead, reverse on the way down." },
  { name: "Front Raise", muscles: ["Shoulders"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 45, howTo: "Raise a dumbbell or plate straight in front of you to shoulder height, lower with control." },
  { name: "Rear Delt Fly", muscles: ["Shoulders", "Back"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 45, howTo: "Bend forward slightly, raise dumbbells out to the sides, squeezing shoulder blades together." },

  // ===== BICEPS =====
  { name: "Barbell Bicep Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Curl the bar up keeping elbows fixed at your sides, control the descent." },
  { name: "Hammer Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Curl dumbbells with a neutral grip, keep elbows still." },
  { name: "Incline Dumbbell Curl", muscles: ["Biceps"], difficulty: "Intermediate", sets: 3, reps: "10-12", restSeconds: 60, howTo: "On an incline bench, let arms hang fully, curl up without swinging." },
  { name: "Preacher Curl", muscles: ["Biceps"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 60, howTo: "Rest your arms on the preacher pad, curl the weight up, control the negative fully." },
  { name: "Cable Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 45, howTo: "Keep elbows pinned to your sides, curl the bar up under constant tension." },
  { name: "Concentration Curl", muscles: ["Biceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 45, howTo: "Brace your elbow against your inner thigh, curl slowly with full focus on the bicep." },

  // ===== TRICEPS =====
  { name: "Tricep Dips", muscles: ["Triceps", "Chest"], difficulty: "Intermediate", sets: 3, reps: "10-12", restSeconds: 75, howTo: "Lower body by bending elbows to ~90 degrees, press back up." },
  { name: "Tricep Rope Pushdown", muscles: ["Triceps"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Push the rope down and apart, keep elbows pinned to your sides." },
  { name: "Close-Grip Bench Press", muscles: ["Triceps", "Chest"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "Grip the bar shoulder-width or slightly closer, lower to the chest keeping elbows tucked, press up." },
  { name: "Overhead Tricep Extension", muscles: ["Triceps"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 60, howTo: "Hold a dumbbell overhead with both hands, lower behind your head, extend back up." },
  { name: "Skull Crusher", muscles: ["Triceps"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 75, howTo: "Lying down, lower the bar toward your forehead by bending only at the elbows, extend back up." },
  { name: "Bench Dip", muscles: ["Triceps", "Chest"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 45, howTo: "Hands on a bench behind you, lower your hips toward the floor, press back up." },
  { name: "Diamond Push-Up", muscles: ["Triceps", "Chest"], difficulty: "Intermediate", sets: 3, reps: "10-15", restSeconds: 60, howTo: "Form a diamond with your hands under your chest, lower down, push back up." },

  // ===== QUADS =====
  { name: "Barbell Back Squat", muscles: ["Quads", "Glutes", "Core"], difficulty: "Intermediate", sets: 4, reps: "6-8", restSeconds: 150, howTo: "Bar on upper back, sit hips back and down, keep chest up, drive through heels to stand." },
  { name: "Leg Press", muscles: ["Quads", "Glutes"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 90, howTo: "Press the platform away, don't lock knees fully, control the return." },
  { name: "Walking Lunges", muscles: ["Quads", "Glutes"], difficulty: "Beginner", sets: 3, reps: "12 each leg", restSeconds: 75, howTo: "Step forward into a lunge, keep front knee over ankle, alternate legs." },
  { name: "Goblet Squat", muscles: ["Quads", "Glutes", "Core"], difficulty: "Beginner", sets: 4, reps: "10-12", restSeconds: 90, howTo: "Hold a dumbbell at chest height, squat down keeping your torso upright, drive back up." },
  { name: "Bulgarian Split Squat", muscles: ["Quads", "Glutes"], difficulty: "Intermediate", sets: 3, reps: "10 each leg", restSeconds: 75, howTo: "Rear foot elevated on a bench, lower into a lunge, drive through the front heel." },
  { name: "Leg Extension", muscles: ["Quads"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Extend your legs fully against the pad, squeeze at the top, lower with control." },
  { name: "Front Squat", muscles: ["Quads", "Core"], difficulty: "Advanced", sets: 4, reps: "6-8", restSeconds: 120, howTo: "Bar rests on front shoulders, keep elbows high, squat down keeping your torso upright." },

  // ===== HAMSTRINGS =====
  { name: "Romanian Deadlift", muscles: ["Hamstrings", "Glutes", "Back"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 100, howTo: "Hinge at hips keeping legs mostly straight, lower bar along shins, feel the hamstring stretch." },
  { name: "Leg Curl", muscles: ["Hamstrings"], difficulty: "Beginner", sets: 3, reps: "12-15", restSeconds: 60, howTo: "Curl the pad toward your glutes, control the negative." },
  { name: "Good Morning", muscles: ["Hamstrings", "Back"], difficulty: "Intermediate", sets: 3, reps: "8-10", restSeconds: 90, howTo: "Bar on your back, hinge forward at the hips keeping a flat back, return to standing." },
  { name: "Stiff-Leg Deadlift", muscles: ["Hamstrings", "Glutes"], difficulty: "Intermediate", sets: 4, reps: "8-10", restSeconds: 90, howTo: "Keep legs almost straight, lower the bar down the front of your legs, feel the stretch, stand back up." },
  { name: "Nordic Curl", muscles: ["Hamstrings"], difficulty: "Advanced", sets: 3, reps: "6-8", restSeconds: 90, howTo: "Anchor your ankles, lower your torso forward as slowly as possible using your hamstrings to control the descent." },

  // ===== GLUTES =====
  { name: "Hip Thrust", muscles: ["Glutes", "Hamstrings"], difficulty: "Beginner", sets: 3, reps: "10-12", restSeconds: 90, howTo: "Upper back on a bench, drive hips up, squeeze glutes at the top." },
  { name: "Glute Bridge", muscles: ["Glutes"], difficulty: "Beginner", sets: 3, reps: "15-20", restSeconds: 45, howTo: "Lying on your back, drive your hips up by squeezing your glutes, lower with control." },
  { name: "Cable Kickback", muscles: ["Glutes"], difficulty: "Beginner", sets: 3, reps: "12-15 each", restSeconds: 45, howTo: "Kick your leg back against cable resistance, squeezing the glute at full extension." },
  { name: "Sumo Deadlift", muscles: ["Glutes", "Hamstrings", "Back"], difficulty: "Advanced", sets: 4, reps: "6-8", restSeconds: 120, howTo: "Wide stance, grip inside your knees, drive through your heels keeping your chest up." },
  { name: "Step-Up", muscles: ["Glutes", "Quads"], difficulty: "Beginner", sets: 3, reps: "10 each leg", restSeconds: 60, howTo: "Step onto a box or bench, drive through the lead leg to stand fully, step back down with control." },

  // ===== CORE =====
  { name: "Plank", muscles: ["Core"], difficulty: "Beginner", sets: 3, reps: "30-60 sec", restSeconds: 45, howTo: "Keep body in a straight line from head to heels, brace your core." },
  { name: "Hanging Leg Raise", muscles: ["Core"], difficulty: "Intermediate", sets: 3, reps: "10-15", restSeconds: 60, howTo: "Hang from a bar, raise legs to hip height or above, control the descent." },
  { name: "Cable Woodchopper", muscles: ["Core", "Shoulders"], difficulty: "Beginner", sets: 3, reps: "12 each side", restSeconds: 45, howTo: "Rotate the cable diagonally across your body, engaging your obliques throughout." },
  { name: "Russian Twist", muscles: ["Core"], difficulty: "Beginner", sets: 3, reps: "20", restSeconds: 45, howTo: "Sit with knees bent, lean back slightly, rotate a weight or medicine ball side to side." },
  { name: "Ab Wheel Rollout", muscles: ["Core", "Shoulders"], difficulty: "Advanced", sets: 3, reps: "8-12", restSeconds: 60, howTo: "Roll the wheel forward keeping your core braced, extend as far as controlled, pull back in." },
  { name: "Bicycle Crunch", muscles: ["Core"], difficulty: "Beginner", sets: 3, reps: "20", restSeconds: 45, howTo: "Alternate bringing elbow to opposite knee in a pedaling motion, keeping your core engaged." },

  // ===== CALVES =====
  { name: "Standing Calf Raise", muscles: ["Calves"], difficulty: "Beginner", sets: 4, reps: "15-20", restSeconds: 45, howTo: "Rise onto your toes as high as possible, pause, lower with control." },
  { name: "Seated Calf Raise", muscles: ["Calves"], difficulty: "Beginner", sets: 3, reps: "15-20", restSeconds: 45, howTo: "With weight on your knees, rise onto your toes, pause at the top, lower slowly." },
  { name: "Single-Leg Calf Raise", muscles: ["Calves"], difficulty: "Intermediate", sets: 3, reps: "12 each leg", restSeconds: 45, howTo: "Balance on one leg, rise onto your toes, lower with control for full range of motion." },
  { name: "Jump Rope", muscles: ["Calves", "Full Body"], difficulty: "Beginner", sets: 3, reps: "60 sec", restSeconds: 45, howTo: "Keep jumps small and quick, land softly on the balls of your feet." },

  // ===== FULL BODY / CONDITIONING =====
  { name: "Burpees", muscles: ["Full Body"], difficulty: "Intermediate", sets: 4, reps: "12-15", restSeconds: 45, howTo: "Drop to a push-up, jump feet in, then jump up explosively." },
  { name: "Kettlebell Swing", muscles: ["Full Body", "Glutes", "Core"], difficulty: "Intermediate", sets: 4, reps: "15-20", restSeconds: 60, howTo: "Hinge at hips, swing the kettlebell to shoulder height using hip power, not arms." },
  { name: "Mountain Climbers", muscles: ["Full Body", "Core"], difficulty: "Beginner", sets: 3, reps: "30 sec", restSeconds: 30, howTo: "In a plank position, drive knees toward chest alternately at a fast pace." },
  { name: "Thruster", muscles: ["Full Body", "Quads", "Shoulders", "Core"], difficulty: "Intermediate", sets: 4, reps: "10", restSeconds: 90, howTo: "Squat down holding weights at your shoulders, drive up and press overhead in one fluid motion." },
  { name: "Box Jump", muscles: ["Full Body", "Quads", "Glutes", "Calves"], difficulty: "Intermediate", sets: 4, reps: "8", restSeconds: 90, howTo: "Swing your arms and jump explosively onto the box, landing softly with bent knees." },
  { name: "Battle Ropes", muscles: ["Full Body", "Shoulders", "Core"], difficulty: "Beginner", sets: 4, reps: "30 sec", restSeconds: 45, howTo: "Alternate slamming the ropes up and down as fast as possible while keeping your core braced." },
  { name: "Sled Push", muscles: ["Full Body", "Quads", "Glutes", "Core"], difficulty: "Intermediate", sets: 4, reps: "20m", restSeconds: 90, howTo: "Drive through your legs, keep your torso low and arms extended, push in short powerful steps." },
  { name: "Wall Ball", muscles: ["Full Body", "Quads", "Shoulders", "Core"], difficulty: "Intermediate", sets: 4, reps: "15", restSeconds: 75, howTo: "Squat down holding a medicine ball, drive up and throw it to a target on the wall, catch and repeat." }
];

const MUSCLE_GROUPS = ["Chest", "Back", "Shoulders", "Biceps", "Triceps", "Quads", "Hamstrings", "Glutes", "Core", "Calves", "Full Body"];