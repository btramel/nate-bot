const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction) {
    // interaction.user is the object representing the User who ran the command
    // interaction.member is the GuildMember object, which represents the user in the specific guild
    function extractUntilYear(dateString) {
      const match = dateString.match(/^(.*?\b\d{4}\b)/);
      return match ? match[1] : dateString;
    }

    const joinedAtDate = extractUntilYear(
      interaction.member.joinedAt.toString()
    );

    await interaction.reply(
      `Sorry to deny you a moment of primate triumph, ${interaction.user.username}, but you'll have to go elsewhere to sound your barbaric yawp. Check the BK Lounge, or something. You've been dawdling around here since ${joinedAtDate} -- you should know better than to pester me with your trifles.`
    );
  },
};
