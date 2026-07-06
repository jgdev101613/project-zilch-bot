const path = require("path");
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
  console.log("[EventHandler] Starting...");

  const eventFolders = getAllFiles(path.join(__dirname, "..", "events"), true);

  console.log("[EventHandler] Folders:", eventFolders);

  for (const eventFolder of eventFolders) {
    console.log(`[EventHandler] Folder: ${eventFolder}`);

    const eventFiles = getAllFiles(eventFolder);

    eventFiles.sort();

    const eventName = eventFolder.replace(/\\/g, "/").split("/").pop();

    console.log(`[EventHandler] Event: ${eventName}`);

    const eventFunctions = eventFiles.map((file) => {
      console.log(`[EventHandler] Requiring: ${file}`);

      const fn = require(file);

      console.log(`[EventHandler] Loaded: ${file}`);

      return fn;
    });

    client.on(eventName, async (...args) => {
      for (const eventFunction of eventFunctions) {
        await eventFunction(client, ...args);
      }
    });
  }

  console.log("[EventHandler] Finished.");
};
