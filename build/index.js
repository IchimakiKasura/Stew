import fs from "fs-extra";
import path from "node:path";
import config, { SRC, DIST, isProd, isDev, isTest, dotdir } from "./config.js";
import bundleCSS from "./work/bundleCSS.js";
import proc from "./process.js";
import log from "./console.js"

async function navigate(dir) {
    for (const f of await fs.readdir(dir)) {
        const full = path.join(dir, f);

        if ((await fs.stat(full)).isDirectory()) {
            await navigate(full);
        } else {
            await proc(full);
        }
    }
}

(async () => {
    const start = performance.now();
    if (isProd)
        log(null, `Building live production files`);
    else if (isDev) 
        log(null, `Building development production files`);
    else if (isTest) {
        log(null, `Test Building, NO OUTPUTS WILL BE BUILT! ASSETS WILL BE SKIPPED!`);
    }
    else {
        log(null, `No chosen option: '--dev', '--prod', '--test'`);
        return;
    }

    log(null, `Build start`);

    if (!isTest) {
        log(null, `Removing files`);
        await fs.remove(DIST);
        await fs.ensureDir(DIST);
    }

    if (isProd || isTest) {
      log(null, `Bundling CSS Files`);
      await bundleCSS();
    }

    await navigate(SRC);
    const end = performance.now() - start;
    log(null, `Build ${config.errorCode === 0 ? "Done!" : "Failed"} (took ${end.toFixed(2)}ms ${config.errorCode === 0 ? "✅" : "❌"})`);
    
    process.exitCode = config.errorCode;
})();
