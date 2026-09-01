// Real MET (Metabolic Equivalent of Task) values from standard exercise physiology tables
const CARDIO_CATEGORIES = {
  "Walking": [
    { name: "Walking (5 km/h)", met: 3.5 },
    { name: "Walking (6.5 km/h)", met: 4.3 },
    { name: "Brisk walking uphill", met: 6.0 }
  ],
  "Running": [
    { name: "Jogging (8 km/h)", met: 8.3 },
    { name: "Running (10 km/h)", met: 9.8 },
    { name: "Running (12 km/h)", met: 11.0 },
    { name: "Running (16 km/h)", met: 16.0 },
    { name: "Treadmill intervals", met: 10.0 }
  ],
  "Cycling": [
    { name: "Leisure cycling", met: 4.0 },
    { name: "Moderate cycling (16-19 km/h)", met: 8.0 },
    { name: "Vigorous cycling (19+ km/h)", met: 10.0 }
  ],
  "Swimming": [
    { name: "Leisure swimming", met: 6.0 },
    { name: "Freestyle laps (moderate)", met: 8.3 },
    { name: "Freestyle laps (vigorous)", met: 10.0 }
  ],
  "Gym": [
    { name: "Weight training (general)", met: 6.0 },
    { name: "Weight training (vigorous)", met: 8.0 },
    { name: "Circuit training", met: 8.0 }
  ],
  "HIIT": [
    { name: "HIIT (general)", met: 8.0 },
    { name: "HIIT (high intensity)", met: 10.0 }
  ],
  "Yoga": [
    { name: "Hatha yoga", met: 2.5 },
    { name: "Power yoga", met: 4.0 }
  ],
  "Team Sports": [
    { name: "Basketball", met: 8.0 },
    { name: "Football", met: 8.0 },
    { name: "Cricket", met: 5.0 }
  ],
  "Racquet Sports": [
    { name: "Tennis", met: 7.3 },
    { name: "Badminton", met: 5.5 },
    { name: "Squash", met: 12.0 }
  ],
  "Combat": [
    { name: "Boxing (training)", met: 7.8 },
    { name: "MMA training", met: 10.0 }
  ],
  "Winter Sports": [
    { name: "Skiing", met: 7.0 },
    { name: "Snowboarding", met: 5.3 }
  ],
  "Low Intensity": [
    { name: "Stretching", met: 2.3 },
    { name: "Light activity", met: 2.5 }
  ],
  "Other": [
    { name: "General activity", met: 5.0 }
  ]
};