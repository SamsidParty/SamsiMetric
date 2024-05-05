import { useState } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

window.selectedMode = -1;

const config = {
    initialColorMode: 'system',
    useSystemColorMode: true,
}

const theme = extendTheme({ config })

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
