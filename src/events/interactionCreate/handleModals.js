const path = require("path");

const getAllFiles = require("../../utils/getAllFiles");

const modalFolders = getAllFiles(
  path.join(__dirname, "..", "..", "modals"),
  true,
);

const modals = [];

for (const folder of modalFolders) {
  const files = getAllFiles(folder);

  for (const file of files) {
    modals.push(require(file));
  }
}

module.exports = async (client, interaction) => {
  if (!interaction.isModalSubmit()) return;

  try {
    const modal = modals.find((m) => m.customId === interaction.customId);

    if (!modal) return;

    await modal.execute(client, interaction);
  } catch (error) {
    console.error(`[Modal] Error executing "${interaction.customId}":`, error);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "There was an error processing this modal.",
        ephemeral: true,
      });
    }
  }
};
