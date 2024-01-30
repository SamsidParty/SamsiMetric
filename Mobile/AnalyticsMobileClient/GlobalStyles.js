import { StyleSheet, Platform, PlatformColor, Appearance } from 'react-native';

var Theme = Appearance.getColorScheme() || "light";
var DarkMode = Theme == "dark";

//Colors Are Functions So That They Respond To Changes
export var GlobalColors = {
    Background: () => DarkMode ? "#161616" : "#FFFFFF",
    Secondary: () => DarkMode ? "#222222" : "#F0F0F0",
    IconBackground: () => GlobalColors.Background()
}