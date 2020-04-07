import { Text } from "@chakra-ui/core"
import formatDistance from "date-fns/formatDistance"
import { pt } from "date-fns/locale"

const LastUpdateInfo = ({ lastUpdate }) => (
	<Text fontSize="m" color="green.500" textAlign="end">
		Última atualização:
		<br />
		<span style={{ fontWeight: "bold" }}>
			{formatDistance(new Date(lastUpdate), new Date(), {
				addSuffix: true,
				locale: pt,
			})}
		</span>
	</Text>
)

export default LastUpdateInfo
