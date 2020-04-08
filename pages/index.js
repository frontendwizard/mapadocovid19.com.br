import { useMemo, useState } from "react"
import Head from "next/head"
import { Heading, Text, Box } from "@chakra-ui/core"
import fetch from "isomorphic-fetch"

import MapBrazil from "../components/MapBrazil"
import DataTable from "../components/DataTable"
import BrazilTotalResults from "../components/BrazilTotalResults"
import Footer from "../components/Footer"
import LastUpdateInfo from "../components/LastUpdateInfo"

const Home = ({ results, lastUpdate }) => {
	const [county, setCounty] = useState(null)
	const columns = useMemo(
		() => [
			{ Header: "estado", accessor: "state" },
			{ Header: "casos", accessor: "confirmed", sortDescFirst: true },
			{ Header: "mortes", accessor: "deaths", sortDescFirst: true },
			{
				Header: "mortalidade",
				// eslint-disable-next-line camelcase
				accessor: ({ death_rate }) =>
					// eslint-disable-next-line camelcase
					death_rate ? `${Math.round(death_rate * 1000) / 10}%` : "0%",
				id: "death_rate",
				sortDescFirst: true,
			},
		],
		[]
	)
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
				<Text fontSize="lg" color="gray.500">
					Selecione um estado para mais detalhes
				</Text>
				<MapBrazil
					results={results}
					selectedState={county}
					onStateSelection={(state) => setCounty(state)}
				/>
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<BrazilTotalResults results={results} />
				<Text fontSize="lg" color="gray.500" mt={6}>
					Dados por estado:
				</Text>
				<DataTable columns={columns} data={results} />
				<Footer />
			</Box>
		</div>
	)
}

export async function getStaticProps() {
	const { results } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
	).then((r) => r.json())
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	return {
		props: { results, lastUpdate: tables[1].import_date },
	}
}

export default Home
