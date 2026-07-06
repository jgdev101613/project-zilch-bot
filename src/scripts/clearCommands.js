require("dotenv").config({ quiet: true });

const { Client, REST, Routes } = require("discord.js");
const { testServer } = require("../../config.json");

const client = new Client({ intents: [] });

(async () => {
  try {
    await client.login(process.env.TOKEN);

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    const applicationId = client.user.id;

    console.log("Clearing guild commands...");

    await rest.put(Routes.applicationGuildCommands(applicationId, testServer), {
      body: [],
    });

    console.log("✅ All guild slash commands removed.");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
