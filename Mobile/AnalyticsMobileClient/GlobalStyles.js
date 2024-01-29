import { StyleSheet, Platform, PlatformColor, Appearance } from 'react-native';

var Theme = Appearance.getColorScheme() || "light";
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
var DarkMode = Theme == "dark";

//Colors Are Functions So That They Respond To Changes
export var GlobalColors = {
    Background: () => DarkMode ? "#161616" : "#F0F0F0",
    Secondary: () => DarkMode ? "#222222" : "#FFFFFF",
    IconBackground: () => GlobalColors.Background()
}

//https://snack.expo.dev/@alabsi91/react-native-material-you-colors
export function CreateAndroidColors(palette) {
    var light = {
      isDark: false,
      primary: palette.system_accent1[7], // shade 500
      text: palette.system_accent1[9], // shade 700
      textColored: palette.system_accent1[2], // shade 50
      background: palette.system_neutral1[1], // shade 10
      card: palette.system_accent2[2], // shade 50
      icon: palette.system_accent1[10], // shade 800
    };
    var dark = {
      isDark: true,
      primary: palette.system_accent1[4], // shade 200
      text: palette.system_accent1[3], // shade 100
      textColored: palette.system_accent1[9], // shade 700
      background: palette.system_neutral1[11], // shade 900
      card: palette.system_accent2[10], // shade 800
      iconBackground: palette.system_accent2[9], // shade 700
      icon: palette.system_accent1[3], // shade 100
    };
    return { light, dark };
}