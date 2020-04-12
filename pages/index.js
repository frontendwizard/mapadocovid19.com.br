import { useMemo, useCallback } from "react"
import Head from "next/head"
import { Heading, Text, Box } from "@chakra-ui/core"
import fetch from "isomorphic-fetch"

import BrazilClorophletMap from "../components/BrazilClorophletMap"
import DataTable from "../components/DataTable"
import BrazilTotalResults from "../components/BrazilTotalResults"
import Footer from "../components/Footer"
import LastUpdateInfo from "../components/LastUpdateInfo"
import leadingSign from "../utils/leadingSign"
import counties from "../utils/counties.json"

const Home = ({ current, previous, lastUpdate }) => {
	const customSort = useCallback((rowA, rowB, columnId) => {
		return rowA.original[columnId] - rowB.original[columnId]
	}, [])
	const columns = useMemo(
		() => [
			{ Header: "estado", accessor: "state" },
			{
				Header: "casos",
				id: "confirmed",
				// eslint-disable-next-line react/display-name
				accessor: ({ confirmed, state }) => {
					const previousConfirmed = previous.find((uf) => uf.state === state)
						.confirmed
					return (
						<>
							<Text as="span">{confirmed}</Text>
							<Text as="span" fontSize="xs" ml={2}>
								[{leadingSign(confirmed - previousConfirmed)}
								{confirmed - previousConfirmed}]
							</Text>
						</>
					)
				},
				sortType: customSort,
				sortDescFirst: true,
			},
			{
				Header: "mortes",
				id: "deaths",
				// eslint-disable-next-line react/display-name
				accessor: ({ deaths, state }) => {
					const previousDeaths = previous.find((uf) => uf.state === state)
						.deaths
					return (
						<>
							<Text as="span">{deaths}</Text>
							<Text as="span" fontSize="xs" ml={2}>
								[{leadingSign(deaths - previousDeaths)}
								{deaths - previousDeaths}]
							</Text>
						</>
					)
				},
				sortType: customSort,
				sortDescFirst: true,
			},
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
				<meta
					name="description"
					content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
				/>
				{/* twitter tags */}
				<meta name="twitter:title" content="Mapa do COVID-19 no Brasil" />
				<meta
					name="twitter:description"
					content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
				/>
				<meta name="twitter:site" content="@frontendwizard" />
				<meta name="twitter:creator" content="@frontendwizard" />
				{/* open graph tags */}
				<meta property="og:type" content="article" />
				<meta property="og:title" content="Mapa do COVID-19 no Brasil" />
				<meta
					property="og:description"
					content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
				/>
				<meta property="og:url" content="https://mapadocovid19.com.br" />
				<meta property="og:site_name" content="mapadocovid19.com.br" />

				<title>Mapa do COVID-19 no Brasil</title>
				<link rel="icon" href="/favicon.ico" />
				<link rel="canonical" href="https://mapadocovid19.com.br/" />
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
				<BrazilClorophletMap results={current} />
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<BrazilTotalResults current={current} previous={previous} />
				<Text fontSize="lg" color="gray.500" mt={6}>
					Dados por estado:
				</Text>
				<DataTable columns={columns} data={current} />
				<Footer />
			</Box>
		</div>
	)
}

export async function getStaticProps() {
	const { results: current } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
	).then((r) => r.json())
	const { results: history } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=false&place_type=state`
	).then((r) => r.json())
	const previous = Object.keys(counties).map((s) =>
		history.find((report) => report.state === s)
	)
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	return {
		props: { current, previous, lastUpdate: tables[1].import_date },
	}
}

export default Home
