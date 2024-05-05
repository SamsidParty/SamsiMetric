import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ColorModeScript } from '@chakra-ui/react'
import './assets/css/Index.css'

window.serverURL = "http://" + window.location.host + "/";

if (navigator.gamepadInputEmulation) {
    navigator.gamepadInputEmulation = "gamepad";
}

//Dev Mode
if (window.location.hostname != "localhost") {
    serverURL = "http://localhost:25631/";

    //Interop Injection Stub
    if (window.external.receiveMessage == undefined) {
        //UWP
        if (window.chrome?.webview) {
            window.chrome.webview.addEventListener('message', message => eval.call(window, message));
        }
        window.external.sendMessage(`{"Type":"load"}`);
    }
    else {
        window.external.receiveMessage(message => eval.call(window, message));
        window.external.sendMessage(`{"Type":"load"}`);
    }
}


function StartReact() {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <>
            <ColorModeScript initialColorMode={"system"} />
            <App />
        </>
    );    
}
window.StartReact = StartReact;
