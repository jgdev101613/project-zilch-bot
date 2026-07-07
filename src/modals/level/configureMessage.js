const getGuildSettings = require("../../services/guildSettings");
const { MessageFlags } = require("discord.js");
const createEmbed = require("../../utils/createEmbed");

const { EMBED_TYPES, UPDATE_TYPES } = require("../../constants");

module.exports = {
  customId: "configure-level-message",

  async execute(client, interaction) {
    try {
      const message = interaction.fields.getTextInputValue("message").trim();

      if (!message.length) {
        return interaction.reply({
          content: "The level-up message cannot be empty.",
          flags: MessageFlags.Ephemeral,
        });
      }

      const settings = await getGuildSettings(interaction.guild.id);

      settings.leveling.levelUpMessage = message;

      await settings.save();

      const embed = createEmbed({
        type: EMBED_TYPES.SUCCESS,
        title: UPDATE_TYPES.LEVELINGUPDATE,
        description: `✅ Successfully updated the level-up message.

        ━━━━━━━━━━━━━━━━━━

        **Preview**

        ${message}`,
      });

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      console.error("[Modal] Failed to update level-up message:", error);

      if (!interaction.replied) {
        await interaction.reply({
          content: "There was an error updating the level-up message.",
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
