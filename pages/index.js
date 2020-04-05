import { useState } from "react"
import Head from "next/head"
import { Heading, Text, Box } from "@chakra-ui/core"
import fetch from "isomorphic-fetch"

import MapBrazil from "../components/MapBrazil"
import BrazilTotalResults from "../components/BrazilTotalResults"

const Home = ({ results }) => {
	const [county, setCounty] = useState(null)
	return (
		<div className="container">
			<Head>
				<title>Mapa do COVID-19 no Brasil</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Box
				as="main"
				padding={4}
				width={["100%", 3 / 4, "700px"]}
				margin={[0, "auto"]}
			>
				<Heading as="h1" fontSize="2xl" mt={0}>
					COVID-19 no Brasil
				</Heading>
				<Text fontSize="xl" color="gray.500">
					Selecione um estado para mais detalhes
				</Text>
				<MapBrazil
					results={results}
					selectedState={county}
					onStateSelection={(state) => setCounty(state)}
				/>
				<BrazilTotalResults results={results} />
			</Box>
		</div>
	)
}

export async function getStaticProps() {
	const res = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
	)
	const { results } = await res.json()
	return {
		props: { results },
	}
}

export default Home
