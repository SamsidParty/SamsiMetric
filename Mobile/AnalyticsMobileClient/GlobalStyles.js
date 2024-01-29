import { StyleSheet, Platform, PlatformColor, Appearance } from 'react-native';

var Theme = Appearance.getColorScheme() || "light";
var DarkMode = Theme == "dark";

//Colors Are Functions So That They Respond To Changes
export var GlobalColors = {
    Background: () => DarkMode ? "#161616" : "#F0F0F0",
    Secondary: () => DarkMode ? "#222222" : "#FFFFFF",
    IconBackground: () => GlobalColors.Background()
}