import { Link, Box, Text } from '@chakra-ui/core'

const Footer = () => (
  <Box color="gray.400" textAlign="center" mt={8}>
    <Text>
      Feito com{' '}
      <Text as="span" color="red.400">
        ♥
      </Text>{' '}
      por{' '}
      <Link
        href="https://twitter.com/frontendwizard"
        color="blue.400"
        isExternal
      >
        @frontendwizard
      </Link>
      .
      <br />
      Dados providos por{' '}
      <Link href="https://brasil.io" color="blue.400" isExternal>
        brasil.io
      </Link>
      .
      <br />
      Críticas e sugestões?
      <br />
      Por favor, abra um issue no{' '}
      <Link
        href="https://github.com/thefrontendwizard/mapadocovid19.com.br"
        color="blue.400"
        isExternal
      >
        github
      </Link>
      .
    </Text>
  </Box>
)

export default Footer
