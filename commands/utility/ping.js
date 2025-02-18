const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies indignantly!"),
  async execute(interaction) {
    await interaction.reply("What in God's name are you on about now?");
  },
};
