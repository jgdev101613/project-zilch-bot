const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "unignorerole",
  description: "Allow users with a role to earn text XP again.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "role",
      description: "Role to remove.",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const role = interaction.options.getRole("role");

    const settings = await getGuildSettings(interaction.guild.id);

    if (!settings) {
      return interaction.editReply({
        content: "No leveling settings found.",
      });
    }

    const index = settings.leveling.text.ignoredRoles.indexOf(role.id);

    if (index === -1) {
      return interaction.editReply({
        content: `${role} isn't ignored.`,
      });
    }

    settings.leveling.text.ignoredRoles.splice(index, 1);

    await settings.save();

    await interaction.editReply({
      content: `✅ ${role} has been removed from ignored roles.`,
    });
  },
};
