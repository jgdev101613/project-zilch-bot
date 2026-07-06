const dotenv = require("dotenv");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const runMigration = require("./migrations");
const { default: mongoose } = require("mongoose");
const loadFonts = require("./utils/loadFonts");

dotenv.config({
  quiet: true,
});

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to database");

    await runMigration();

    loadFonts();

    console.log("Loading events...");
    eventHandler(client);
    console.log("Events loaded.");

    console.log("Logging in...");
    await client.login(process.env.TOKEN);
    console.log("Login successful.");
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();
