import React from 'react'
import Router from 'next/router'
import { ChakraProvider, theme } from '@chakra-ui/react'

import * as gtag from '../lib/gtag'

Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))

const App = ({ Component, pageProps }) => (
  <ChakraProvider resetCSS theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>
)

export default App
