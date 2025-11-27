console.log("[index.js] Starting...");
const app = require("./app");
console.log("[index.js] App loaded");
const config = require("./utils/config");
const logger = require("./utils/logger");

console.log("[index.js] About to listen on port", config.PORT);
app.listen(config.PORT, "0.0.0.0", () => {
  console.log("[index.js] Server callback fired, listening on 0.0.0.0:" + config.PORT);
  logger.info(`Server running on port ${config.PORT}`);
});
