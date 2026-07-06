const GuildSettings = require("../../models/guildSettingsSchema");
const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "rewardadd",
  description: "Adds a level reward.",

  permissionsRequired: [PermissionFlagsBits.ManageGuild],

  botPermissions: [PermissionFlagsBits.ManageRoles],

  options: [
    {
      name: "level",
      description: "Required level",
      type: ApplicationCommandOptionType.Integer,
      required: true,
    },
    {
      name: "role",
      description: "Reward role",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const level = interaction.options.getInteger("level");

    const role = interaction.options.getRole("role");

    let settings = await GuildSettings.findOne({
      guildId: interaction.guild.id,
    });

    if (!settings) {
      settings = await GuildSettings.create({
        guildId: interaction.guild.id,
      });
    }

    const exists = settings.leveling.rewardRoles.find((r) => r.level === level);

    if (exists) {
      exists.roleId = role.id;
    } else {
      settings.leveling.rewardRoles.push({
        level,
        roleId: role.id,
      });
    }

    await settings.save();

    await interaction.reply({
      content: `✅ Level **${level}** now rewards ${role}.`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
