import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, SafeAreaView } from 'react-native';
import { TopBar, MainView } from "./MainComponents.js";
import { Global } from "./Global.js";
import { Logs } from 'expo'

Logs.enableExpoCliLogging()

function App()
{
  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: Global.Colors.Secondary() }}/>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <TopBar />
        <MainView />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Global.Colors.Background(),
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;