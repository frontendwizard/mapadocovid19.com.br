import React from "react"
import { theme, ThemeProvider } from "@chakra-ui/core"
import "normalize.css"

const App = ({ Component, pageProps }) => (
	<ThemeProvider theme={theme}>
		<Component {...pageProps} />
	</ThemeProvider>
)

export default App
