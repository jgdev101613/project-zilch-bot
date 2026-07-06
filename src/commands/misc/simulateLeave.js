const guildMemberLeave = require("../../events/guildMemberRemove/guildLeave");
const { ApplicationCommandOptionType, MessageFlags } = require("discord.js");

module.exports = {
  name: "simulateleave",
  description: "Simulates a member leaving the server.",
  devOnly: true,
  options: [
    {
      name: "user",
      description: "User to simulate.",
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const user = interaction.options.getUser("user") ?? interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    await guildMemberLeave(client, member);

    await interaction.editReply(`Simulated join event for ${member}.`);
  },
};
