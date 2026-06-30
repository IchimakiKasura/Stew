import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = __dirname.replace("build", "");

export const SRC = path.join(rootDir, "src");
export const DIST = path.join(rootDir, "dist");

export const isTest = process.argv[2] === "--test";
export const isDev = process.argv[2] === "--dev";
export const isProd = process.argv[2] === "--prod";
export const dotdir = process.argv[3] === "--dotdir";

export let errorCode = 0;

export default {
    SRC,
    DIST,
    isTest,
    isDev,
    isProd,
    errorCode,
    dotdir
};
