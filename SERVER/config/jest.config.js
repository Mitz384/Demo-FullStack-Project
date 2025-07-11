const path = require("path");

module.exports = {
  testEnvironment: "node",
  rootDir: path.resolve(__dirname, '..'),
  moduleNameMapper: {
    "^@routes/(.*)$": "<rootDir>/routers/$1",
    "^@controllers/(.*)$": "<rootDir>/controllers/$1",
    "^@config/(.*)$": "<rootDir>/config/$1",
  },
  moduleDirectories: ["node_modules", path.join(__dirname)],
};
