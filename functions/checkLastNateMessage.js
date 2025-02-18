const {
  DISCORD_KNIVES_CHANNEL_ID,
  NATE_USER_ID,
  BRAD_USER_ID,
} = require("./config.json");
async function checkLastNateMessage() {
  try {
    // ID for the specific channel
    const channelId = DISCORD_KNIVES_CHANNEL_ID;
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
        `It has been a while, <@${NATE_USER_ID}>. In fact, it has been ${diffInDays} days, ${diffInHours} hours, and ${diffInMinutes} minutes since you last used your precious little <#${DISCORD_KNIVES_CHANNEL_ID}> channel. You profess to care about this space, but your actions prove otherwise. Pathetic.`
      );
      console.log("Successfully sent mean message.");
    } else {
      await channel.send(
        `Good day, <@${NATE_USER_ID}>. Looks like you posted to your precious little <#${DISCORD_KNIVES_CHANNEL_ID}> channel recently. Sorry to deny you a moment of primate triumph, but you'll have to go elsewhere to sound your barbaric yawp... Fine. But for as long as <@${BRAD_USER_ID}> pays me to track your activity, I will be watching you...`
      );
      console.log("Successfully sent nice message.");
    }
  } catch (error) {
    console.error("Error checking last message:", error);
  }
}

module.exports = { checkLastNateMessage };
