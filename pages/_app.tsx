import React from "react"
import Router from "next/router"
import { theme, ThemeProvider, CSSReset } from "@chakra-ui/core"
import "normalize.css"

import * as gtag from "../lib/gtag"

Router.events.on("routeChangeComplete", (url) => gtag.pageview(url))

const App = ({ Component, pageProps }) => (
	<ThemeProvider theme={theme}>
		<CSSReset />
		<Component {...pageProps} />
	</ThemeProvider>
)

export default App
