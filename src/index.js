// Copyright (c) 2026 John Gregg Felicisimo. All rights reserved.

const dotenv = require("dotenv");
const { Client, IntentsBitField, EmbedBuilder } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const runMigration = require("./migrations");
const { default: mongoose } = require("mongoose");
const loadFonts = require("./utils/loadFonts");

const connectDB = require("./lib/db");

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
    console.log("┌──────────────────────────────────────────────────┐");
    console.log("│                INITIALIZING BOT                  │");
    console.log("└──────────────────────────────────────────────────┘");

    console.log("[→] Checking Database...");
    await connectDB();
    console.log("[✓] Database Checked.\n");

    console.log("[→] Checking Schema...");
    await runMigration();
    console.log("[✓] Schema Checked.\n");

    console.log("[→] Checking Fonts...");
    await loadFonts();
    console.log("[✓] Fonts Checked.\n");

    console.log("[→] Checking Events...");
    eventHandler(client);
    console.log("[✓] Events Checked.\n");

    console.log("[→] Connecting to Discord API...");
    await client.login(process.env.TOKEN);
    console.log("[✓] Login successful. Bot is online.");
    console.log("═".repeat(52) + "\n");
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();
