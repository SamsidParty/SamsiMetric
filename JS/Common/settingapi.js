AutoLoadThisFile();

window.SettingSchema = {
    Client: GetClientSettings()
}

window.Settings = {

}

function GetClientSettings() {
    return {
        Appearance: {
            "name": "Appearance",
            "icon": "ti ti-palette",
            "settings": [
                {
                    "type": "bool",
                    "displayname": "Use Enhanced Readability Font",
                    "name": "useEnhancedReadabilityFont",
                    "default": isMobile,
                    "current": isMobile,
                    onChange: (newVal) => newVal ? LoadEnhancedReadabilityFont() : UnloadEnhancedReadabilityFont()
                    
                }
            ]
        },
        About: {
            "name": "About",
            "icon": "ti ti-info-circle",
            "settings": [
                {
                    "type": "bool",
                    "displayname": "Is Mobile",
                    "name": "isMobile",
                    "default": isMobile,
                    "current": isMobile
                },
                {
                    "type": "bool",
                    "displayname": "Is Desktop",
                    "name": "isDesktop",
                    "default": isDesktop,
                    "current": isDesktop
                }
            ]
        },
    }
}