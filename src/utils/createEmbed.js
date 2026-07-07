const { EmbedBuilder } = require("discord.js");

const COLORS = {
  SUCCESS: 0x57f287, // Discord Green
  ERROR: 0xed4245, // Discord Red
  INFO: 0x5865f2, // Discord Blurple
  WARNING: 0xfee75c, // Discord Yellow
  LEVELUPMESSAGE: 0x57f287,
};

module.exports = ({
  type = "INFO",
  title,
  description,
  fields = [],
  footer = null,
  thumbnail = null,
  image = null,
}) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: process.env.AUTHOR_NAME || "Tsarnikov",
      iconURL:
        process.env.AUTHOR_URL ||
        "https://ik.imagekit.io/projectzilch/me?updatedAt=1782881611073",
      url: process.env.AUTHOR_PAGE || "https://jgdev101.netlify.app/",
    })
    .setColor(COLORS[type] ?? COLORS.INFO)
    .setTitle(title)
    .setTimestamp();

  if (description) embed.setDescription(description);

  if (fields.length) embed.addFields(fields);

  if (image) embed.setImage(image);

  if (footer)
    embed.setFooter({
      text: footer,
    });

  if (thumbnail) embed.setThumbnail(thumbnail);

  return embed;
};
