AutoLoadThisFile();

RunOnLoad("./JS/Common/theming.js", Theming);

async function LoadFontFiles() {
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/Jetbrains.woff2");
    await LoadDependency("./Fonts/Tabler.ttf");

    if (window.GetFromGlobal && isApple) {
        //SFPro Is A Whopping 26MB!
        //Load It From The iOS Host Instead Of The Client
        var SFPro = await GetFromGlobal("SFPro");
        await eval(SFPro);
    }
    else {
        //Replace SFPro With Inter As A Stub
        loadedBinaryDependencies["./Fonts/SFPro.ttf"] = loadedBinaryDependencies["./Fonts/InterVariable.woff2"];
    }
}

async function Theming() {

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark");
    }

    await LoadFontFiles();
}