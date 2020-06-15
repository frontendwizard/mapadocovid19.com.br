import { Box, Text } from '@chakra-ui/core'
import formatDistance from 'date-fns/formatDistance'
import { pt } from 'date-fns/locale'

const LastUpdateInfo = ({ lastUpdate }) => (
  <Box my={4} textAlign="right">
    <Text
      as="span"
      color="green.400"
      p={2}
      bg="green.100"
      fontWeight="bold"
      rounded="md"
    >
			Atualizado{' '}
      {formatDistance(new Date(lastUpdate), new Date(), {
        addSuffix: true,
        locale: pt,
      })}
    </Text>
  </Box>
)

export default LastUpdateInfo
