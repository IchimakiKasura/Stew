import fs from "fs-extra";
import path from "node:path";
import config, { SRC, DIST, isProd, isDev, isTest } from "./config.js";
import bundleCSS from "./work/bundleCSS.js";
import proc from "./process.js";

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
        console.log(`[SYSTEM] Building live production files`);
    else if (isDev) 
        console.log(`[SYSTEM] Building development production files`);
    else if (isTest) {
        console.log(`[SYSTEM] Test Building, NO OUTPUTS WILL BE BUILT! ASSETS WILL BE SKIPPED!`);
    }
    else {
        console.log(`[SYSTEM] No chosen option: '--dev', '--prod', '--test'`);
        return;
    }

    console.log(`[SYSTEM] Build start`);

    if (!isTest) {
        console.log(`[SYSTEM] Removing files`);
        await fs.remove(DIST);
        await fs.ensureDir(DIST);
    }

    if (isProd || isTest) {
      console.log(`[SYSTEM] Bundling CSS Files`);
      await bundleCSS();
    }

    await navigate(SRC);
    const end = performance.now() - start;
    console.log(`[SYSTEM] Build ${config.errorCode === 0 ? "Done!" : "Failed"} (took ${end.toFixed(2)}ms ${config.errorCode === 0 ? "✅" : "❌"})`);
    
    // Fixed: process.exitCode is a property, not a function
    process.exitCode = config.errorCode;
})();
