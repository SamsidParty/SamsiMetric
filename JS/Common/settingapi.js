AutoLoadThisFile();

window.Settings = {
    Client: GetClientSettings()
}


function GetClientSettings() {
    return {
        Appearance: {
            "name": "Appearance",
            "icon": "ti ti-palette"
        },
        About: {
            "name": "About",
            "icon": "ti ti-info-circle",
            "settings": [
                {
                    "type": "info",
                    "name": "isMobile",
                    "value": isMobile
                },
                {
                    "type": "info",
                    "name": "isDesktop",
                    "value": isDesktop
                }
            ]
        },
    }
}