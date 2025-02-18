const fs = require("node:fs");
const path = require("node:path");
// Require the necessary discord.js classes
const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  Collection,
} = require("discord.js");

const { DISCORD_TOKEN } = require("./config.json");

// Create a new client instance with needed intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel],
});

// load command files into bot
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath) // reads the path to the above directory and returns an array of all the file names they contain.
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file); // helps to construct a path to the commands directory.
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// When the client is ready, run this code
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // scheduleDailyNateChirp();
  // checkLastNateMessage();
});

// create event listener that is ready to respond to commands
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

// IDEAS
//
// Create a randomized post about Schmitty's Runescape runs w DPS, drop, time spent

// Create a summarizer of each Rocket League session with each person's total goals, saves, assists, wins and losses (& # of concessions).
// Need to create and connect a database.

// Mr. House says a random line twice a day?

// Mr. House welcomes new Discord users. Announces their arrival and quotes from the game. + "I'm watching you..."
//
//

// Log in to Discord with your client's token
client.login(DISCORD_TOKEN);
