const path = require("path");

module.exports = {
    SRC: path.join(__dirname.replace("build", ""), "src"),
    DIST: path.join(__dirname.replace("build", ""), "dist"),

    isTest: process.argv[2] === "--test",
    isDev: process.argv[2] === "--dev",
    isProd: process.argv[2] === "--prod",

    errorCode: 0
};