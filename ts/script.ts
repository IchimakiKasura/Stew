document.addEventListener("DOMContentLoaded", () => {
    const cookBtn = document.getElementById("cook-btn") as HTMLButtonElement | null;
    const terminalLog = document.getElementById("terminal-log") as HTMLElement | null;
    const copyText = document.getElementById("copy-text");

    if (!cookBtn || !terminalLog || !copyText)  return;

    copyText.addEventListener("click", () => {
        navigator.clipboard.writeText("git clone https://github.com/IchimakiKasura/Stew");
        const e = copyText.innerText;
        copyText.innerText = "📋 Copied repo link!",
        copyText.style.borderColor = "#00ffcc",
        setTimeout( () => {
            copyText.innerText = e,
            copyText.style.borderColor = ""
        }
        , 2e3)
    });

    interface BuildStep {
        prefixText: string;
        prefixClass: "text-yellow" | "text-green" | "text-orange" | "text-teal" | "text-white";
        logText: string;
    }

    const steps: BuildStep[] = [
        { prefixText: ">", prefixClass: "text-white", logText: " StewJS@1.0 build:prod" },
        { prefixText: "[SYSTEM]", prefixClass: "text-white", logText: " Build start" },
        { prefixText: "[SYSTEM]", prefixClass: "text-white", logText: " Removing old files from dist/" },
        { prefixText: "[JavaScript]", prefixClass: "text-yellow", logText: " script.js -> Stripping development blocks..." },
        { prefixText: "[JavaScript]", prefixClass: "text-yellow", logText: " script.js -> Remapping dynamic paths to .min.js..." },
        { prefixText: "[JavaScript]", prefixClass: "text-yellow", logText: " script.js -> Minified via Terser ✅" },
        { prefixText: "[Cascading Style Sheet]", prefixClass: "text-teal", logText: " Parsing component folder assets..." },
        { prefixText: "[Cascading Style Sheet]", prefixClass: "text-teal", logText: " style.css bundle compiled via CleanCSS ✅" },
        { prefixText: "[Hyper Text Markup Language]", prefixClass: "text-orange", logText: " index.html -> Swapping development markers..." },
        { prefixText: "[Hyper Text Markup Language]", prefixClass: "text-orange", logText: " index.html -> Linked /css/bundle.min.css" },
        { prefixText: "[ASSETS]", prefixClass: "text-green", logText: " picture.webp -> copied to dist" },
        { prefixText: "[ASSETS]", prefixClass: "text-green", logText: " icon.ico -> copied to dist" },
        { prefixText: "[SYSTEM]", prefixClass: "text-white", logText: " Build Done! (took 4.67ms 🎉)" }
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