import { useState } from 'react'
import { ChakraProvider, extendTheme, Button } from '@chakra-ui/react'

window.selectedMode = -1;

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const theme = extendTheme({ config });

var serverList = [
    {
        name: "Dev Server",
        url: "https://192.168.100.100:8083/Analytics/Dashboard"
    }
]


function App() {

    var loadProfile = (server) => {
        window.location.href = server.url;
    }

    return (
        <>
            <ChakraProvider theme={theme}>
                <div className="setupContainer">
                    <div className="setupModal selectServerModal">
                        <p className="mobileOnly mobileIcon">&#xeb1f;</p>
                        <h1>Select Profile</h1>
                        <div className="serverList">
                            {
                                serverList.length > 0 ?
                                (serverList.map((l_server, l_index) => {
                                    return (
                                        <Button onClick={() => loadProfile(l_server)} className="serverListItem" key={l_index}>
                                            <h2>{l_server.name}</h2>
                                        </Button>
                                    )
                                })) : 
                                (<p>No Profiles Available, Connect To A Server To Create One</p>)
                            }
                        </div>
                    </div>
                </div>
            </ChakraProvider>
        </>

    )
}

export default App
