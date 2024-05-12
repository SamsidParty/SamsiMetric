import { useState } from 'react'
import { ChakraProvider, extendTheme, Button } from '@chakra-ui/react'

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

window.selectedMode = -1;

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const theme = extendTheme({ config });

var serverList = [
    {
        name: "Dev Server (Build)",
        url: "http://192.168.100.100:8082/Analytics/Build"
    },
    {
        name: "Dev Server (Bleeding Edge)",
        url: "http://192.168.100.100:8082/Analytics"
    }
]


function App() {

    var [isLoading, setIsLoading] = useState(false);

    var loadProfile = async (server) => {
        server = Object.assign({}, server); // Duplicate The Object So We Don't Modify It
        setIsLoading(true);

        //Format The URL
        if (!server.url.endsWith("/")) {
            server.url += "/";
        }
        if (server.url.endsWith("/Dashboard/")) {
            server.url = server.url.replace("/Dashboard/", "/");
        }

        setTimeout(() => {
            //Attempt To Access The Manifest Of The Server
            fetch(server.url + "manifest.json").then((req) => {
                if (req.ok) {
                    window.location.href = server.url + "Dashboard";
                }
                else {
                    alert(`Failed To Connect To The Server (ERROR ${req.statusText})`);
                    setIsLoading(false);
                }
            }).catch(() => {
                alert("Failed To Connect To The Server");
                setIsLoading(false);
            })
        }, 1500);

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
                <Drawer
                    isOpen={isLoading}
                    placement='left'
                    size="full"
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerBody className='serverLoadingDrawer'>
                            <img src='/Loading.svg'></img>
                            <h2>Connecting To Server...</h2>
                        </DrawerBody>
                    </DrawerContent>
                </Drawer>
            </ChakraProvider>
        </>

    )
}

export default App
