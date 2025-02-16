// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

// Create a new client instance with needed intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// When the client is ready, run this code
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // Schedule the daily check
  scheduleDaily();
});

// Function to schedule the daily check at 4 PM CST
function scheduleDaily() {
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
    checkLastMessage();

    // Then schedule it to run every 24 hours
    setInterval(checkLastMessage, 24 * 60 * 60 * 1000);
  }, timeUntilTarget);

  console.log(
    `Scheduled first check in ${timeUntilTarget / 1000 / 60} minutes`
  );
}

// Function to check when Kuechy last sent a message
async function checkLastMessage() {
  try {
    // ID for the specific channel
    const channelId = process.env.DISCORD_KNIVES_CHANNEL_ID;
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isTextBased()) {
      console.error("Channel not found or not a text channel");
      return;
    }

    // Fetch the last 10 messages from the channel
    const lastTwentyMessages = await channel.messages.fetch({ limit: 20 });
    const lastTwentyMessagesSentBy = [...lastTwentyMessages.values()].map(
      (each, i) => {
        return {
          id: each.author.valueOf(),
          index: i,
          username: each.author.username,
          timestamp: each.createdTimestamp,
          when: new Date(each.createdTimestamp).toISOString(),
        };
      }
    );

    // Filter for messages from Nate
    const nateMessages = lastTwentyMessagesSentBy.filter(
      (user) => user.id === "678824035089514498"
    );

    if (nateMessages.size === 0) {
      console.log("Can't find messages from Nate in the last 20 messages");
      return;
    }

    // Get the most recent message
    const lastMessage = nateMessages[0];
    const lastMessageTime = lastMessage.timestamp;
    const now = new Date();

    // Calculate time difference
    const diffInMs = now - lastMessageTime;
    const hasBeenLongerThanTwoDays =
      diffInMs > 1000 * 60 * 60 * 24 * 2 ? true : false;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(
      (diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const diffInMinutes = Math.floor(
      (diffInMs % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Send the message to the channel
    if (hasBeenLongerThanTwoDays) {
      await channel.send(
        `It has been a while, <@${process.env.NATE_USER_ID}>. In fact, it has been ${diffInDays} days, ${diffInHours} hours, and ${diffInMinutes} minutes since you last used your precious little <#${process.env.DISCORD_KNIVES_CHANNEL_ID}> channel. You profess to care about this space, but your actions prove otherwise. Pathetic.`
      );
      console.log("Successfully sent mean message.");
    } else {
      await channel.send(
        `Good day, <@${process.env.NATE_USER_ID}>. Looks like you posted to your precious little <#${process.env.DISCORD_KNIVES_CHANNEL_ID}> channel recently. Sorry to deny you a moment of primate triumph, but you'll have to go elsewhere to sound your barbaric yawp... Fine. But for as long as <@${process.env.BRAD_USER_ID}> pays me to track your activity, I will be watching you...`
      );
      console.log("Successfully sent nice message.");
    }
  } catch (error) {
    console.error("Error checking last message:", error);
  }
}

// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);
