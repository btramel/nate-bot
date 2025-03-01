const { SlashCommandBuilder } = require("discord.js");
const replies = [
  "What in God's name are you on about now?",
  "What? WHAT??",
  "The Bingo Palace is more than a server, it's the remedy to mankind's ... derailment. What is the BK Lounge? A society of people desperate to experience comfort, ease, luxury. I am its curator, its foreman, its steward. Give me 20 years and I'll reignite the high technology development sectors. 50 years and I'll have people in orbit. 100 years and my colony ships will be heading for the stars to search for planets unpolluted by the wrath and folly of a bygone generation. What I'm offering you is a ground floor opportunity in the most important enterprise on earth. What I'm offering is a future - for you, and for what remains of the human race.",
  "You see that you and I are of a different stripe, don't you? We don't have to dream that we're important. We are.",
  "Sorry to deny you a moment of primate triumph, but you'll have to go elsewhere to sound your barbaric yawp.",
  "Success depends on forethought, dispassionate calculation of probabilities, accounting for every stray variable.",
  "I like to think you have enough sense to do the right thing around here. The rewards for doing so are immense... as are the punishments for not doing so.",
];
module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies indignantly."),
  async execute(interaction) {
    const randomNum = Math.round(Math.random(replies.length)) * 10;
    function getRandomInt(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    const randomReply = replies[getRandomInt(0, replies.length)];
    await interaction.reply(randomReply);
  },
};
