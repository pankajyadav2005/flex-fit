const SPORTS_DATA = {
  // ===== STRENGTH & PHYSIQUE =====
  "Bodybuilding": { icon: "🏆", goals: ["Lean bulk", "Aggressive bulk", "Cutting / fat loss", "Body recomposition", "Build bigger arms", "Wider shoulders", "Stronger chest", "Grow legs and glutes", "Prep for a show", "Maintain physique", "Improve symmetry", "Increase strength while lean"] },
  "Powerlifting": { icon: "🏋️", goals: ["Increase 1RM total", "Improve squat depth", "Bench press PR", "Deadlift technique", "Peak for a meet", "Build raw strength", "Improve bar speed", "Manage a weight class"] },
  "CrossFit": { icon: "🔥", goals: ["Improve WOD times", "First muscle-up", "Snatch technique", "Clean and jerk PR", "Build work capacity", "Compete in a local comp", "Improve gymnastics skills", "Engine and conditioning"] },
  "Calisthenics": { icon: "🤲", goals: ["First pull-up", "Muscle-up", "Handstand push-up", "Human flag", "Planche progression", "One-arm pull-up", "Build relative strength", "Bodyweight skill training"] },

  // ===== RUNNING =====
  "Running": { icon: "🏃", goals: ["Run a first 5K", "Sub-25 minute 5K", "Run a 10K", "Half marathon", "Full marathon", "Improve running economy", "Build base endurance", "Return from injury"] },
  "Trail Running": { icon: "⛰️", goals: ["First trail race", "Improve technical descents", "Build vertical gain endurance", "Ultra marathon prep", "Strengthen ankles and stability", "Fuel long runs properly"] },
  "Sprinting": { icon: "💨", goals: ["Improve 100m time", "Faster acceleration off the blocks", "Increase top-end speed", "Sprint mechanics and form", "Build explosive power", "Reduce hamstring injury risk"] },

  // ===== COMBAT =====
  "Martial Arts": { icon: "🥋", goals: ["Rotational power", "Shoulder injury prevention", "Improve speed", "Build conditioning", "Karate speed"] },
  "Boxing": { icon: "🥊", goals: ["Improve punching power", "Footwork and head movement", "Build boxing conditioning", "Sparring endurance", "Core rotational strength", "Cut weight for a fight"] },
  "Kickboxing": { icon: "🦵", goals: ["Improve kick power", "Hip mobility for kicks", "Combo speed and flow", "Build fight conditioning", "Balance and core control"] },
  "Brazilian Jiu-Jitsu": { icon: "🤼", goals: ["Grip strength", "Core and hip mobility", "Build mat conditioning", "Prevent common BJJ injuries", "Explosive scrambles", "Prep for a competition"] },
  "Wrestling": { icon: "🤼‍♂️", goals: ["Neck and grip strength", "Explosive takedowns", "Cut weight for a weight class", "Build mat conditioning", "Improve sprawl speed"] },

  // ===== CYCLING =====
  "Cycling": { icon: "🚴", goals: ["Build aerobic base", "Climb better", "Increase FTP", "Century ride", "Criterium racing power", "Indoor training gains", "Improve sprint watts", "Lose weight for climbing"] },
  "Mountain Biking": { icon: "🚵", goals: ["Improve technical handling", "Build climbing endurance", "Downhill core stability", "Increase power-to-weight ratio", "Endurance for long trail rides"] },

  // ===== SWIMMING / TRIATHLON =====
  "Swimming": { icon: "🏊", goals: ["Swim 1 km non-stop", "Improve freestyle technique", "Faster 100m", "Open water endurance", "Build shoulder resilience", "Triathlon swim leg"] },
  "Triathlon": { icon: "🏅", goals: ["Sprint triathlon", "Olympic triathlon", "Ironman 70.3", "Full Ironman", "Improve transitions", "Balance swim/bike/run training", "Brick workout endurance"] },

  // ===== FLEXIBILITY / MOBILITY =====
  "Yoga": { icon: "🧘", goals: ["Daily mobility habit", "Deeper hip flexibility", "Improve balance", "Stress and recovery", "Build yoga strength", "Back pain relief"] },
  "Pilates": { icon: "🩰", goals: ["Build core control", "Improve posture", "Increase flexibility", "Low-impact strength", "Injury rehab support", "Better mind-muscle connection"] },

  // ===== TEAM SPORTS =====
  "Football": { icon: "⚽", goals: ["Improve sprint endurance", "Build agility and change of direction", "Increase shot power", "In-season maintenance", "Off-season strength", "Reduce injury risk"] },
  "Basketball": { icon: "🏀", goals: ["Increase vertical jump", "Build lateral quickness", "In-game endurance", "Explosive first step", "Off-season strength", "Reduce ankle/knee injuries"] },
  "Volleyball": { icon: "🏐", goals: ["Increase vertical jump", "Explosive spiking power", "Shoulder health and stability", "Lateral agility", "In-season maintenance"] },
  "Cricket": { icon: "🏏", goals: ["Bowling speed and power", "Batting rotational strength", "Fielding agility", "Injury prevention for fast bowlers", "In-season conditioning"] },
  "Baseball": { icon: "⚾", goals: ["Increase throwing velocity", "Rotational power for hitting", "Shoulder and elbow health", "Sprint speed on the bases", "In-season maintenance"] },
  "Rugby": { icon: "🏉", goals: ["Build tackling strength", "Increase sprint power", "In-game conditioning", "Injury resilience", "Off-season strength", "Scrum/contact strength"] },
  "Hockey": { icon: "🏒", goals: ["Skating power and stride length", "Build lateral agility", "In-game conditioning", "Shot power", "Off-season strength"] },
  "Team Sports": { icon: "🤾", goals: ["General team-sport conditioning", "Explosiveness and agility", "In-season maintenance", "Off-season strength"] },

  // ===== RACQUET SPORTS =====
  "Racquet Sports": { icon: "🏸", goals: ["Tennis endurance", "Badminton footwork", "Squash conditioning", "Table tennis reflexes", "Improve reaction time", "Doubles teamwork"] },

  // ===== GYMNASTICS =====
  "Gymnastics": { icon: "🤸", goals: ["First pull-up", "Muscle-up", "Handstand hold", "Front lever", "Back lever", "Planche progression", "Improve mobility", "Ring strength"] },

  // ===== OUTDOOR / ADVENTURE =====
  "Rock Climbing": { icon: "🧗", goals: ["Increase grip strength", "Improve finger and forearm endurance", "Build climbing-specific power", "Improve technique and footwork", "Injury prevention for tendons", "Send a harder grade"] },
  "Hiking": { icon: "🥾", goals: ["Build hiking endurance", "Strengthen knees for descents", "Improve pack-carrying stamina", "Prep for a multi-day trek", "Altitude conditioning"] },

  // ===== WATER SPORTS =====
  "Water Sports": { icon: "🏄", goals: ["Surfing paddle fitness", "Rowing power", "Kayaking endurance", "Water polo conditioning", "Diving core control", "Sailing strength"] },
  "Surfing": { icon: "🌊", goals: ["Improve paddle endurance", "Pop-up speed and power", "Shoulder and rotator cuff health", "Balance and core stability", "Build surf-specific conditioning"] },
  "Rowing": { icon: "🚣", goals: ["Increase 2k erg time", "Build rowing-specific power", "Improve stroke technique", "Endurance for long pieces", "Leg drive strength"] },

  // ===== WINTER SPORTS =====
  "Winter Sports": { icon: "⛷️", goals: ["Snowboard core control", "Ski leg endurance", "Ice skating power", "Pre-season conditioning", "Cold weather conditioning", "Balance on snow"] },
  "Skiing": { icon: "⛷️", goals: ["Build leg endurance for long runs", "Improve balance and edge control", "Pre-season conditioning", "Core stability for moguls", "Injury prevention for knees"] },
  "Snowboarding": { icon: "🏂", goals: ["Build core control for carving", "Improve balance and ankle stability", "Pre-season conditioning", "Explosive power for jumps", "Injury prevention for wrists"] },

  // ===== DANCE / SKATE =====
  "Dance": { icon: "💃", goals: ["Improve flexibility and turnout", "Build core and postural strength", "Increase stamina for routines", "Injury prevention", "Improve balance and control"] },
  "Skateboarding": { icon: "🛹", goals: ["Improve balance and ankle stability", "Build explosive leg power", "Core control for tricks", "Injury prevention (wrists/ankles)", "Increase confidence on ramps"] },

  // ===== PRECISION / TARGET =====
  "Target Sports": { icon: "🎯", goals: ["Show jumping fitness", "Manage riding weight", "Archery shoulder stability", "Shooting steadiness", "Golf rotational power"] },
  "Golf": { icon: "⛳", goals: ["Increase swing rotational power", "Improve hip and thoracic mobility", "Build core stability", "Reduce lower back pain", "Add distance off the tee"] },

  // ===== EQUESTRIAN =====
  "Equestrian": { icon: "🐎", goals: ["Knee resilience", "Altitude endurance", "Riding core stability", "Leg endurance in the saddle", "Balance and posture"] },

  // ===== MULTI-SPORT / GENERAL =====
  "Multi-Sport": { icon: "🏅", goals: ["Golf mobility", "Focus and breath control", "Hybrid strength and endurance", "Obstacle course racing", "Decathlon athleticism", "Cross-training variety"] },
  "General Fitness": { icon: "✨", goals: ["Lose weight", "Get toned", "Build a workout habit", "Improve energy levels", "Better sleep and recovery", "Healthy ageing and strength", "Post-pregnancy fitness", "Improve heart health"] }
};