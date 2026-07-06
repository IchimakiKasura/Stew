import fs from "fs-extra";
import path from "node:path";
import CleanCSS from "clean-css";
import config from "../config.js";

async function bundleCSS() {
    const cssFolderNames = ["css", "style", "styles"];

    async function getTargetFolders(dir) {
        let results = [];
        const items = await fs.readdir(dir, { withFileTypes: true });

        for (const item of items) {
            const fullPath = path.join(dir, item.name);
            
            if (item.isDirectory()) {
                if (cssFolderNames.includes(item.name.toLowerCase())) {
                    results.push(fullPath);
                } else {
                    results = results.concat(await getTargetFolders(fullPath));
                }
            }
        }
        return results;
    }

    const targetFolders = await getTargetFolders(config.src);

    for (const srcDirPath of targetFolders) {
        const relativePath = path.relative(config.src, srcDirPath);
        const distDirPath = path.join(config.dist, relativePath);
        const outputFileName = "bundle.min.css";

        let bundle = "";
        const files = (await fs.readdir(srcDirPath)).filter(f => f.endsWith(".css"));

        if (files.length === 0) continue;

        for (const file of files) {
            log(file, `Bundling file`);
            bundle += await fs.readFile(path.join(srcDirPath, file), "utf8") + "\n";
        }

        try {
            log(outputFileName, `Minifying (${outputFileName})`); 
            const minified = new CleanCSS({}).minify(bundle).styles;

            if (!config.mode.isTest) {
                await fs.outputFile(path.join(distDirPath, outputFileName), minified);
            }
        } catch (err) {
            config.errorCode = 1;
            log(outputFileName, `Failed ❌ [${err}]`);
        }
    }
}

export default bundleCSS;
