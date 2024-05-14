AutoLoadThisFile();

RunOnLoad("./JS/Common/theming.js", Theming);

async function LoadFontFiles() {
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/Jetbrains.woff2");
    await LoadDependency("./Fonts/Tabler.ttf");

    //Use Dyslexic Font
    if (!!Settings.useDyslexicFont) {
        await LoadDyslexicFont();
    }
    //Use The System Font If On Mobile
    else if (window.isMobile) {
        LoadCSSDependency(`* { --standard-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; }`);
    }
}

async function LoadDyslexicFont() {
    //Don't Load It If It's Already Loaded
    if (!!document.querySelector(".dyslexicFont")) { return; }

    await LoadDependency("./Fonts/OpenDyslexic.ttf");

    LoadCSSDependency(`

    @font-face {
        font-family: OpenDyslexic;
        font-style: normal;
        src: url("./LOADER_LOAD_BIN/./Fonts/OpenDyslexic.ttf/FINISH") format("truetype");
    }    

    * { --standard-font: OpenDyslexic !important; }

    `, false, "dyslexicFont");
}

async function UnloadDyslexicFont() {
    //The Font Isn't Loaded
    if (!document.querySelector(".dyslexicFont")) { return; }

    document.querySelector(".dyslexicFont").remove();
}

async function Theming() {

    window.isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) {
        document.body.classList.add("dark");
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches && !document.body.classList.contains("dark")) {
            document.body.classList.add("dark");
        } 
        else if (!event.matches && document.body.classList.contains("dark")) {
            document.body.classList.remove("dark");
        } 
    });

    await LoadFontFiles();
}