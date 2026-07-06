const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a member from the server.",
  // devOnly
  // testOnly
  options: [
    {
      name: "target-user",
      description: "The user to ban",
      require: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for the ban",
      require: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  devOnly: true,

  callback: (client, interaction) => {
    interaction.reply("Ban command is under development.");
  },
};
