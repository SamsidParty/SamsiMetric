
setTimeout(async () => {
    var androidTheme = `

    .android, .android * {
        --col-primary: ${await GetFromGlobal("Colors.matprimary")};
    }
    
    .android, .android * {
        --col-bg: ${await GetFromGlobal("Colors.matbackground")} !important;
    }

    `
    
    LoadCSSDependency(androidTheme);
}, 0);

