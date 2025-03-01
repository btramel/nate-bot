const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Provides information about the server."),
  async execute(interaction) {
    // interaction.guild is the object representing the Guild in which the command was run
    await interaction.reply(
      `${interaction.guild.name} is more than a server. It's the remedy to mankind's... derailment. We have ${interaction.guild.memberCount} members and you're lucky to be one of them.`
    );
  },
};
