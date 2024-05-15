AutoLoadThisFile();

RunOnLoad("./JS/Common/theming.js", Theming);

var ThemeComponents = {
    "EnhancedReadabilityFont": {
        "name": "EnhancedReadabilityFont",
        "css": ` * { --standard-font: Jetbrains !important; }`
    }
}

async function LoadFontFiles() {
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/Jetbrains.woff2");
    await LoadDependency("./Fonts/Tabler.ttf");

    //Use EnhancedReadability Font
    if (!!Settings.useEnhancedReadabilityFont) {
        await LoadThemeComponent(ThemeComponents["EnhancedReadabilityFont"]);
    }
    //Use The System Font If On Mobile
    else if (window.isMobile) {
        LoadCSSDependency(`* { --standard-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol" !important; }`);
    }
}

async function LoadThemeComponent(tc) {
    //Don't Load It If It's Already Loaded
    if (!!document.querySelector(".tc-" + tc.name)) { return; }

    LoadCSSDependency(tc.css, false, "tc-" + tc.name);
}

async function UnloadThemeComponent(tc) {
    //The Theme Component Isn't Loaded
    if (!document.querySelector(".tc-" + tc.name)) { return; }

    document.querySelector(".tc-" + tc.name).remove();
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