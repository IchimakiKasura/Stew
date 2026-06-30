document.addEventListener("DOMContentLoaded", () => {
    const cookBtn = document.getElementById("cook-btn") as HTMLButtonElement | null;
    const terminalLog = document.getElementById("terminal-log") as HTMLElement | null;

    if (!cookBtn || !terminalLog) return;

    interface BuildStep {
        prefixText: string;
        prefixClass: "text-orange" | "text-teal";
        logText: string;
    }

    const steps: BuildStep[] = [
        { prefixText: "[SYSTEM]", prefixClass: "text-orange", logText: " Build start" },
        { prefixText: "[SYSTEM]", prefixClass: "text-orange", logText: " Removing old files from dist/" },
        { prefixText: "[TypeScript]", prefixClass: "text-teal", logText: " Compiles source ts down to ESModules..." },
        { prefixText: "[JavaScript]", prefixClass: "text-orange", logText: " script.js -> Stripping development blocks..." },
        { prefixText: "[JavaScript]", prefixClass: "text-orange", logText: " script.js -> Remapping dynamic paths to .min.js..." },
        { prefixText: "[JavaScript]", prefixClass: "text-orange", logText: " script.js -> Minified via Terser ✅" },
        { prefixText: "[Cascading Style Sheet]", prefixClass: "text-teal", logText: " Parsing component folder assets..." },
        { prefixText: "[Cascading Style Sheet]", prefixClass: "text-teal", logText: " style.css bundle compiled via CleanCSS ✅" },
        { prefixText: "[Hyper Text Markup Language]", prefixClass: "text-orange", logText: " index.html -> Swapping development markers..." },
        { prefixText: "[Hyper Text Markup Language]", prefixClass: "text-orange", logText: " index.html -> Linked /css/bundle.min.css" },
        { prefixText: "[SYSTEM]", prefixClass: "text-orange", logText: " Build Done! (took 4.12ms 🎉)" }
    ];

    let cooking = false;

    cookBtn.addEventListener("click", async () => {
        if (cooking) return;
        cooking = true;
        
        cookBtn.disabled = true;
        cookBtn.innerText = "Cooking...";
        terminalLog.innerHTML = "";

        for (const step of steps) {
            const lineWrapper = document.createElement("div");
            lineWrapper.className = "log-line";

            const prefixSpan = document.createElement("span");
            prefixSpan.className = step.prefixClass;
            prefixSpan.textContent = step.prefixText;

            const textNode = document.createTextNode(step.logText);

            lineWrapper.appendChild(prefixSpan);
            lineWrapper.appendChild(textNode);
            
            if (step.logText.includes("Build Done!")) {
                lineWrapper.className = "log-line text-teal";
            }

            terminalLog.appendChild(lineWrapper);
            terminalLog.scrollTop = terminalLog.scrollHeight;
            
            await new Promise((resolve) => setTimeout(resolve, 180));
        }

        cooking = false;
        cookBtn.disabled = false;
        cookBtn.innerText = "Cook another Build";
    });

    const SOCIAL_LINKS: Record<string, string> = {
        dc: "https://discord.com/users/1515722036209520940",
        gh: "https://github.com/IchimakiKasura",
        gm: "malto:ichimakikasura@gmail.com"
    };

    document.querySelectorAll<HTMLElement>("[data-social]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const platform = btn.dataset.social;

            if (platform && SOCIAL_LINKS[platform]) {
                if(platform == 'gm') {
                    window.location.href = SOCIAL_LINKS[platform];
                } else window.open(SOCIAL_LINKS[platform]);
            }
        });
    });
});