//A Global Object That Is Used To Share Data Between Unrelated Components (Kind Of Like window In Browsers)

import { GlobalColors } from "./GlobalStyles.js";
import prompt from 'react-native-prompt-android';
import * as Clipboard from 'expo-clipboard';
import { decode as atob, encode as btoa } from 'base-64';
import { Alert } from 'react-native';

export var Global = {
    Colors: GlobalColors,
    Platform: Platform.OS,
    consolelog: (e) => console.log(e),
    alert: (e, d) => Alert.alert(e, d),
    prompt: (e, r) => PromptForData(e, r),
    clipboardData: async () => await Clipboard.getStringAsync()
};

async function PromptForData(options, request) {

    options = JSON.parse(options);

    var value = await new Promise((resolve, reject) => {

        var buttons = [];
        options.buttons?.forEach((l_button) => {
            buttons.push(
                {
                    text: l_button.text,
                    style: l_button.style,
                    onPress: (data) => resolve([l_button.value, data])
                }
            );
        });

        prompt(
            options.title || "",
            options.subtitle || "",
            buttons,
            options.options || {
                type: "default",
                cancelable: false,
                defaultValue: '',
                placeholder: 'placeholder'
            }
        )
    });

    Global.webView?.injectJavaScript(`window.returnQueue["${btoa(request)}"](${JSON.stringify(value)});`);

}