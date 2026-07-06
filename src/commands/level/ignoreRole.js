const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

const getGuildSettings = require("../../services/guildSettings");

module.exports = {
  name: "ignorerole",
  description: "Prevent users with a role from earning text XP.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.SendMessages],

  options: [
    {
      name: "role",
      description: "Role to ignore.",
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
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    if (settings.leveling.text.ignoredRoles.includes(role.id)) {
      return interaction.editReply({
        content: `${role} is already ignored.`,
      });
    }

    settings.leveling.text.ignoredRoles.push(role.id);

    await settings.save();

    await interaction.editReply({
      content: `✅ ${role} has been added to ignored roles.`,
    });
  },
};
