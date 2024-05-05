import { useState } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

window.selectedMode = -1;

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const theme = extendTheme({ config })

window.location.href = "http://192.168.100.100:8082/Analytics/Build/Dashboard";

function App() {
    return (
        <>
            <ChakraProvider theme={theme}>
                <h1>Test</h1>
            </ChakraProvider>
        </>

    )
}

export default App
