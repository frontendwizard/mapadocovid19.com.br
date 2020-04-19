import fetch from "isomorphic-fetch"
import { Heading, Text, Box } from "@chakra-ui/core"
import { useRouter } from "next/router"

import * as County from "../components/County"
import LastUpdateInfo from "../components/LastUpdateInfo"
import Footer from "../components/Footer"

import fetchAllReports from "../utils/fetchAllReports"
import citiesData from "../utils/cities.json"
import countiesName from "../utils/counties.json"

const Post = ({
	counties,
	cities,
	countyCitiesHistory,
	history,
	lastUpdate,
}) => {
	const router = useRouter()
	const { county } = router.query

	return (
		<div className="container">
			<County.Headers />
			<Box
				as="main"
				padding={4}
				width={["100%", 3 / 4, "700px"]}
				margin={[0, "auto"]}
			>
				<Heading as="h1" fontSize="2xl" mt={0}>
					COVID-19 em {countiesName[county]}
				</Heading>
				<Text fontSize="lg" color="gray.500">
					Selecione uma cidade para mais detalhes
				</Text>
				<County.Map results={counties} cities={cities} />
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<County.TotalResults history={history} />
				<Text fontSize="lg" color="gray.500" mt={6}>
					Dados por cidade:
				</Text>
				<County.DataTable
					countyCitiesHistory={countyCitiesHistory}
					cities={cities}
				/>
				<Footer />
			</Box>
		</div>
	)
}

export default Post

export async function getStaticProps({ params: { county } }) {
	// get last update for counties
	const counties = await fetchAllReports(`is_last=true&place_type=state`)
	// get last update for all cities in the country for the circles
	const rawCitiesLastUpdate = await fetchAllReports(
		`is_last=true&place_type=city`
	)
	// get previous update for cities in the county
	const countyCitiesHistory = await fetchAllReports(
		`is_last=false&place_type=city&state=${county}`
	)
	const cities = rawCitiesLastUpdate
		// eslint-disable-next-line camelcase
		.filter(({ city_ibge_code }) => !!city_ibge_code)
		.map((result) => {
			const { latitude: lat, longitude: lon } = citiesData.find(
				(m) => `${m.codigo_ibge}` === result.city_ibge_code
			)
			return { ...result, coords: { lat, lon } }
		})
	// get county history
	const history = await fetchAllReports(`place_type=state&state=${county}`)
	// get last update info
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	return {
		props: {
			counties,
			cities,
			countyCitiesHistory,
			history,
			lastUpdate: tables[1].import_date,
		},
	}
}

export async function getStaticPaths() {
	return {
		paths: Object.keys(countiesName).map((county) => ({ params: { county } })),
		fallback: false,
	}
}
