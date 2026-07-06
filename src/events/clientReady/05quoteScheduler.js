const startQuoteScheduler = require("../../jobs/randomQuotes");

module.exports = async (client) => {
  startQuoteScheduler(client);
};
