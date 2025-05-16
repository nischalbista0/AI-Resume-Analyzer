const app = require("./app");
const databaseConnection = require("./config/database");
const dotenv = require("dotenv");
const createDefaultAdmin = require("./utils/createAdmin");

dotenv.config({ path: "./config/config.env" });

// Connect to database and create default admin
databaseConnection()
  .then(() => {
    createDefaultAdmin();
    // Start the server after database connection
    app.listen(process.env.PORT, () => {
      console.log(`server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
