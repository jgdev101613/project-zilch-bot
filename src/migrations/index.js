const fs = require("fs");
const path = require("path");

const Migration = require("../models/migrationSchema");

module.exports = async () => {
  const migrationFiles = fs
    .readdirSync(__dirname)
    .filter((file) => file !== "index.js" && file.endsWith(".js"))
    .sort();

  for (const file of migrationFiles) {
    const alreadyExecuted = await Migration.exists({
      name: file,
    });

    if (alreadyExecuted) {
      console.log(`[Migration] Skipping ${file}`);
      continue;
    }

    console.log(`[Migration] Running ${file}...`);

    const migration = require(path.join(__dirname, file));

    await migration();

    await Migration.create({
      name: file,
    });

    console.log(`[Migration] Completed ${file}`);
  }

  console.log("[Migration] Database is up to date.");
};
