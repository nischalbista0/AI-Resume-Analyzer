const mongoose = require("mongoose");

const databaseConnection = () => {
  console.log(process.env.DB);
  return mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((data) => {
      console.log(
        `database connected successfully at server ${data.connection.host}`
      );
      return data;
    })
    .catch((err) => {
      console.error("Database connection error:", err);
      throw err;
    });
};

module.exports = databaseConnection;
