const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
const { MessageFlags } = require("discord.js");

// ==========================
// Command Cache
// ==========================
// By declaring this outside the export, Node.js executes it once
// upon startup and caches the result in memory.
const localCommands = getLocalCommands();

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    // Look up the command from the in-memory cache
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName,
    );

    if (!commandObject) return;

    // ==========================
    // Permission Checks
    // ==========================
    if (commandObject.devOnly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: "Only developers are allowed to run this command.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    if (commandObject.testOnly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: "This command cannot be ran outside of the test server.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }
    }

    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          interaction.reply({
            content: "You do not have permission to run this command.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      }
    }

    if (commandObject.botPermissions?.length) {
      for (const permission of commandObject.botPermissions) {
        const bot = interaction.guild.members.me;

        if (!bot.permissions.has(permission)) {
          interaction.reply({
            content: "I do not have permission to run this command.",
            flags: MessageFlags.Ephemeral,
          });
          return;
        }
      }
    }

    // ==========================
    // Execute Command
    // ==========================
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.error(`There was an error executing the command: ${error}`);
  }
};
