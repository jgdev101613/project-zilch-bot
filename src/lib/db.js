/*
 * Licensed Software
 * For authorized client use only.
 * Unauthorized modification or redistribution is prohibited.
 * Full license terms available in LICENSE.md
 */

const mongoose = require("mongoose");

module.exports = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[Database] Connection established ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
