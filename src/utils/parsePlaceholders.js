/**
 * Parses placeholders inside a template string.
 *
 * Example:
 * parsePlaceholders(
 *   "Hello {user}, welcome to {guild}!",
 *   {
 *     user: "@John",
 *     guild: "Project Zilch",
 *   }
 * );
 *
 * Result:
 * Hello @John, welcome to Project Zilch!
 *
 * @param {string|null|undefined} template
 * @param {Object<string, any>} placeholders
 * @returns {string}
 */
module.exports = function parsePlaceholders(template, placeholders = {}) {
  if (template === null || template === undefined) {
    return "";
  }

  let output = String(template);

  for (const [key, value] of Object.entries(placeholders)) {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    output = output.replace(
      new RegExp(`\\{${escapedKey}\\}`, "gi"),
      value ?? "N/A",
    );
  }

  return output;
};
