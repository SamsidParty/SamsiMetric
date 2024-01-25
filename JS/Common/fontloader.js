AutoLoadThisFile();

RunOnLoad("./JS/Common/fontloader.js", LoadFontFiles);

async function LoadFontFiles() {
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/PJK.ttf");
    await LoadDependency("./Fonts/Tabler.ttf");
}