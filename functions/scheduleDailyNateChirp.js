function scheduleDailyNateChirp() {
  const now = new Date();

  // Convert 4 PM CST to UTC (CST is UTC-6, or UTC-5 during daylight saving)
  // You may need to adjust this based on daylight saving time
  let targetHour = 22; // 4 PM CST in UTC during standard time

  // Calculate the time until next 4 PM CST
  let targetTime = new Date();
  targetTime.setUTCHours(targetHour, 0, 0, 0);

  // If it's already past 4 PM CST today, schedule for tomorrow
  if (now > targetTime) {
    targetTime.setUTCDate(targetTime.getUTCDate() + 1);
  }

  const timeUntilTarget = targetTime - now;

  // Schedule the first run
  setTimeout(() => {
    checkLastNateMessage();

    // Then schedule it to run every 24 hours
    setInterval(checkLastNateMessage, 24 * 60 * 60 * 1000);
  }, timeUntilTarget);

  console.log(
    `Scheduled first check in ${timeUntilTarget / 1000 / 60} minutes`
  );
}

module.exports = { scheduleDailyNateChirp };
