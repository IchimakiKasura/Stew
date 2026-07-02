import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname.replace("build", "");

const arg = process.argv[2];

const config = {
    root: rootDir,

    src: path.join(rootDir, "src"),
    dist: path.join(rootDir, "dist"),

    mode: {
        isDev: arg === "--dev",
        isProd: arg === "--prod",
        isTest: arg === "--test"
    },

    flags: {
        dotdir: process.argv.includes("--dotdir")
    },

    errorCode: 0
};

export default config;