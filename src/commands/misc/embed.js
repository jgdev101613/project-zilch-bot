const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  EmbedBuilder,
  ChannelType,
  MessageFlags,
} = require("discord.js");

const COLORS = {
  Blue: "#3498DB",
  Green: "#2ECC71",
  Red: "#E74C3C",
  Yellow: "#F1C40F",
  Purple: "#9B59B6",
  Pink: "#FF69B4",
  Orange: "#E67E22",
  White: "#FFFFFF",
  Black: "#000000",
  Grey: "#95A5A6",
};

function isValidURL(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  name: "embed",
  description: "Create and send a custom embed.",
  permissionsRequired: [PermissionFlagsBits.ManageMessages],

  options: [
    {
      name: "channel",
      description: "Channel to send the embed.",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required: true,
    },
    {
      name: "title",
      description: "Embed title.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "description",
      description: "Embed description.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "color",
      description: "Embed color.",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "🔵 Blue", value: "Blue" },
        { name: "🟢 Green", value: "Green" },
        { name: "🔴 Red", value: "Red" },
        { name: "🟡 Yellow", value: "Yellow" },
        { name: "🟣 Purple", value: "Purple" },
        { name: "🩷 Pink", value: "Pink" },
        { name: "🟠 Orange", value: "Orange" },
        { name: "⚪ White", value: "White" },
        { name: "⚫ Black", value: "Black" },
        { name: "⚙ Grey", value: "Grey" },
        { name: "🌈 Random", value: "Random" },
      ],
    },
    {
      name: "url",
      description: "Title URL.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "thumbnail",
      description: "Thumbnail image URL.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "image",
      description: "Large image URL.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "author",
      description: "Author name.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "author_icon",
      description: "Author icon URL.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "footer",
      description: "Footer text.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "footer_icon",
      description: "Footer icon URL.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "timestamp",
      description: "Include timestamp.",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  callback: async (client, interaction) => {
    await interaction.deferReply({
      flags: MessageFlags.Ephemeral,
    });

    const channel = interaction.options.getChannel("channel");

    const title = interaction.options.getString("title");
    const description = interaction.options.getString("description");
    const color = interaction.options.getString("color") ?? "Blue";
    const url = interaction.options.getString("url");
    const thumbnail = interaction.options.getString("thumbnail");
    const image = interaction.options.getString("image");
    const author = interaction.options.getString("author");
    const authorIcon = interaction.options.getString("author_icon");
    const footer = interaction.options.getString("footer");
    const footerIcon = interaction.options.getString("footer_icon");
    const timestamp = interaction.options.getBoolean("timestamp");

    const embed = new EmbedBuilder();

    if (title) embed.setTitle(title);

    if (description) embed.setDescription(description);

    if (url) {
      if (!isValidURL(url)) return interaction.editReply("Invalid URL.");

      embed.setURL(url);
    }

    if (thumbnail) {
      if (!isValidURL(thumbnail))
        return interaction.editReply("Invalid thumbnail URL.");

      embed.setThumbnail(thumbnail);
    }

    if (image) {
      if (!isValidURL(image))
        return interaction.editReply("Invalid image URL.");

      embed.setImage(image);
    }

    if (author) {
      if (authorIcon && !isValidURL(authorIcon))
        return interaction.editReply("Invalid author icon URL.");

      embed.setAuthor({
        name: author,
        iconURL: authorIcon || undefined,
      });
    }

    if (footer) {
      if (footerIcon && !isValidURL(footerIcon))
        return interaction.editReply("Invalid footer icon URL.");

      embed.setFooter({
        text: footer,
        iconURL: footerIcon || undefined,
      });
    }

    if (timestamp) embed.setTimestamp();

    if (color === "Random") {
      embed.setColor(Math.floor(Math.random() * 0xffffff));
    } else {
      embed.setColor(COLORS[color]);
    }

    await channel.send({
      embeds: [embed],
    });

    await interaction.editReply({
      content: `Embed sent successfully to ${channel}.`,
    });
  },
};
