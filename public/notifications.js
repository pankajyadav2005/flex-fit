// Real, data-driven reminders using the browser's Notification API.
// Limitation: these only fire while the site is open in a tab — true background
// push notifications need a service worker + push server, which is out of scope here.

async function enableReminders() {
  if (!('Notification' in window)) {
    alert('Notifications are not supported in this browser.');
    return;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    checkAndNotify();
    // Re-check every 30 minutes while the tab stays open
    setInterval(checkAndNotify, 30 * 60 * 1000);
    alert('Reminders enabled! You\'ll see them while this site is open.');
  } else {
    alert('Notification permission was not granted.');
  }
}

async function checkAndNotify() {
  if (Notification.permission !== 'granted') return;

  try {
    // Check today's workout
    const workoutRes = await fetch('/api/workout');
    if (workoutRes.status === 401) return; // not logged in, skip silently
    const workoutData = await workoutRes.json();
    const todayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()];
    const doneToday = workoutData.completions.some(c => c.day_name === todayName);

    if (!doneToday && new Date().getHours() >= 17) {
      new Notification('FlexFit Reminder', { body: "You haven't logged today's workout yet — even a short session counts!" });
    }

    // Check last weight log
    const weightRes = await fetch('/api/weight');
    const weightLogs = await weightRes.json();
    if (weightLogs.length > 0) {
      const lastLog = new Date(weightLogs[weightLogs.length - 1].logged_at);
      const daysSince = Math.floor((Date.now() - lastLog) / (1000 * 60 * 60 * 24));
      if (daysSince >= 5) {
        new Notification('FlexFit Reminder', { body: `It's been ${daysSince} days since your last weight log.` });
      }
    }

    // Check today's food logging
    const foodRes = await fetch('/api/food-log');
    const foodData = await foodRes.json();
    if (foodData.totals.calories === 0 && new Date().getHours() >= 19) {
      new Notification('FlexFit Reminder', { body: "No meals logged today yet — log what you've eaten to stay on track." });
    }
  } catch (err) {
    console.log('Reminder check skipped:', err.message);
  }
}