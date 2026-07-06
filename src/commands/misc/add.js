const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "add",
  description: "Adds two numbers.",

  options: [
    {
      name: "first",
      description: "The first number.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "second",
      description: "The second number.",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],

  callback: async (client, interaction) => {
    const first = interaction.options.getNumber("first");
    const second = interaction.options.getNumber("second");

    const result = first + second;

    await interaction.reply({
      content: `😑 srsly?? para kang di nag highschool nan... malamang **${result}**`,
    });
  },
};
