require("dotenv").config();

const PORT = process.env.PORT || 3000;

// Debug logging for CI troubleshooting
console.log("[config.js] NODE_ENV:", process.env.NODE_ENV);
console.log(
  "[config.js] TEST_MONGODB_URI set:",
  !!process.env.TEST_MONGODB_URI
);
console.log("[config.js] MONGODB_URI set:", !!process.env.MONGODB_URI);

const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

console.log("[config.js] Selected MONGODB_URI set:", !!MONGODB_URI);

module.exports = {
  MONGODB_URI,
  PORT,
};
