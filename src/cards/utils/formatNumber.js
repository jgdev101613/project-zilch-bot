/**
 * Formats a number into a compact human-readable string.
 *
 * Examples:
 * 950 -> 950
 * 1250 -> 1.3K
 * 15200 -> 15.2K
 * 1400600 -> 1.4M
 * 2500000000 -> 2.5B
 *
 * @param {number} number
 * @returns {string}
 */
module.exports = function formatNumber(number) {
  if (number < 1000) {
    return number.toString();
  }

  const units = ["K", "M", "B", "T"];

  let value = number;
  let unit = -1;

  while (value >= 1000 && unit < units.length - 1) {
    value /= 1000;
    unit++;
  }

  return `${parseFloat(value.toFixed(1))}${units[unit]}`;
};
