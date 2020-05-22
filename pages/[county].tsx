import { Stack, Flex, Image, Heading, Text, Box } from "@chakra-ui/core"
import { useRouter } from "next/router"
import fetch from "isomorphic-fetch"

import * as County from "../components/County"
import LastUpdateInfo from "../components/LastUpdateInfo"
import Footer from "../components/Footer"
import PageHeader from "../components/PageHeader"

import fetchAllReports from "../utils/fetchAllReports"
import citiesData from "../utils/cities.json"
import counties from "../utils/counties.json"

const CountyPage = ({ citiesReports, history, lastUpdate }) => {
	const router = useRouter()
	const { county } = router.query
	const { name } = counties.find(({ initials }) => initials === county)

	return (
		<>
			<County.Headers />
			<Stack
				as="main"
				padding={4}
				width={["100%", 3 / 4, "700px", "1000px"]}
				margin={[0, "auto"]}
				spacing={4}
			>
				<Flex justify="center">
					<PageHeader />
				</Flex>
				<Heading as="h1" fontSize="2xl" fontWeight="bold" textAlign="center">
					{name}
				</Heading>
				<Flex justify="center" align="center" wrap="wrap">
					<Box flexBasis={["100%", "50%"]} mb={[4, 0]} mr={[0, 4]}>
						<County.Map cities={citiesReports} />
					</Box>
					<Box flexBasis={["100%", "40%"]}>
						<County.TotalResults data={history} />
					</Box>
				</Flex>
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<Stack spacing={2}>
					<Text fontSize="lg" color="gray.500" mt={6}>
						Dados por cidade:
					</Text>
					<County.DataTable cities={citiesReports} />
				</Stack>
				<Footer />
			</Stack>
		</>
	)
}

export default CountyPage

export async function getStaticProps({ params: { county } }) {
	// // get last update for all cities in the country for the circles
	console.log(`fetching last reports for cities...`)
	const rawCitiesLastUpdate = await fetchAllReports(
		`is_last=true&place_type=city`
	)
	console.log(`fetched ${rawCitiesLastUpdate.length} items`)
	console.log(`adding coords to cities last update...`)
	const citiesReports = rawCitiesLastUpdate
		// eslint-disable-next-line camelcase
		.filter(({ city_ibge_code }) => !!city_ibge_code)
		.map((result) => {
			const { latitude: lat, longitude: lon } = citiesData.find(
				(m) => m.codigo_ibge === result.city_ibge_code
			)
			return { ...result, coords: { lat, lon } }
		})
	// get county history
	console.log(`fetching all reports for ${county}...`)
	const history = await fetchAllReports(`place_type=state&state=${county}`)
	console.log(`fetched ${history.length} items`)
	// get last update info
	console.log(`fetching timestamp...`)
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	console.log(`timestamp: ${tables[1].import_date}`)
	return {
		props: {
			citiesReports,
			history,
			lastUpdate: tables[1].import_date,
		},
	}
}

export async function getStaticPaths() {
	return {
		paths: counties.map(({ initials }) => ({ params: { county: initials } })),
		fallback: false,
	}
}
