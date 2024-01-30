import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { TopBar, MainView } from "./MainComponents.js";
import { PaperProvider } from 'react-native-paper';
import { Global } from "./Global.js";
import { Logs } from 'expo';
import { useFonts } from 'expo-font';

Logs.enableExpoCliLogging()

function App()
{
  var [fontIsLoaded] = useFonts({ 'Inter-Variable': require('./assets/Fonts/Inter-Variable.ttf') });

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: Global.Colors.Background() }} />
      <PaperProvider>
        <View style={styles.container}>
          <StatusBar style="auto" />
          <TopBar />
          <MainView />
        </View>
      </PaperProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.Colors.Secondary(),
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;