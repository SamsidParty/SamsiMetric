AutoLoadThisFile();

RunOnLoad("./JS/Common/fontloader.js", LoadFontFiles);

async function LoadFontFiles() {
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/Jetbrains.woff2");
    await LoadDependency("./Fonts/Tabler.ttf");
}