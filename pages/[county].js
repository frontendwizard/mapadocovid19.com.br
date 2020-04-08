/* eslint-disable camelcase */
import { useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import fetch from "isomorphic-fetch"
import Head from "next/head"
import { Heading, Text, Box } from "@chakra-ui/core"

import DataTable from "../components/DataTable"
import CountyTotalResults from "../components/CountyTotalResults"
import LastUpdateInfo from "../components/LastUpdateInfo"
import Footer from "../components/Footer"
import CountyMap from "../components/CountyMap"
import municipalities from "../utils/municipalities.json"
import leadingSign from "../utils/leadingSign"

const Post = ({
	counties,
	cities,
	countyCitiesHistory,
	history,
	lastUpdate,
}) => {
	const customSort = useCallback((rowA, rowB, columnId) => {
		return rowA.original[columnId] - rowB.original[columnId]
	}, [])
	const router = useRouter()
	const { county } = router.query
	const columns = useMemo(
		() => [
			{ Header: "cidade", accessor: "city" },
			{
				Header: "casos",
				id: "confirmed",
				// eslint-disable-next-line react/display-name
				accessor: ({ confirmed, city_ibge_code }) => {
					const previous = countyCitiesHistory.find(
						(report) => city_ibge_code === report.city_ibge_code
					)
					if (!previous)
						return (
							<>
								<Text as="span">{confirmed}</Text>
							</>
						)
					const previousConfirmed = previous.confirmed
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
				accessor: ({ deaths, city_ibge_code }) => {
					const previous = countyCitiesHistory.find(
						(report) => city_ibge_code === report.city_ibge_code
					)
					if (!previous)
						return (
							<>
								<Text as="span">{deaths}</Text>
							</>
						)
					const previousDeaths = previous.deaths
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
				accessor: ({ death_rate }) =>
					death_rate ? `${Math.round(death_rate * 1000) / 10}%` : "0%",
				id: "death_rate",
				sortDescFirst: true,
			},
			{
				Header: "população",
				id: "estimated_population_2019",
				// eslint-disable-next-line react/display-name
				accessor: ({ estimated_population_2019 }) =>
					estimated_population_2019.toLocaleString(),
				sortType: customSort,
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
				<CountyMap results={counties} cities={cities} />
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<CountyTotalResults history={history} />
				<Text fontSize="lg" color="gray.500" mt={6}>
					Dados por cidade:
				</Text>
				<DataTable
					columns={columns}
					data={cities.filter((c) => c.state === county)}
				/>
				<Footer />
			</Box>
		</div>
	)
}

export default Post

export async function getStaticProps({ params: { county } }) {
	// get last update for counties
	const { results: counties } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=state`
	).then((data) => data.json())
	// get last update for all cities in the country for the circles
	const { results: rawCitiesLastUpdate } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=true&place_type=city`
	).then((data) => data.json())
	// get previous update for cities in the county
	const { results: countyCitiesHistory } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?is_last=false&place_type=city&state=${county}`
	).then((data) => data.json())
	const cities = rawCitiesLastUpdate
		// eslint-disable-next-line camelcase
		.filter(({ city_ibge_code }) => !!city_ibge_code)
		.map((result) => {
			const { latitude: lat, longitude: lon } = municipalities.find(
				(m) => `${m.codigo_ibge}` === result.city_ibge_code
			)
			return { ...result, coords: { lat, lon } }
		})
	// get county history
	const { results: history } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?place_type=state&state=${county}`
	).then((data) => data.json())
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
		paths: [
			{ params: { county: "AP" } },
			{ params: { county: "PA" } },
			{ params: { county: "RR" } },
			{ params: { county: "AC" } },
			{ params: { county: "AL" } },
			{ params: { county: "AM" } },
			{ params: { county: "BA" } },
			{ params: { county: "CE" } },
			{ params: { county: "DF" } },
			{ params: { county: "ES" } },
			{ params: { county: "GO" } },
			{ params: { county: "MA" } },
			{ params: { county: "MG" } },
			{ params: { county: "MS" } },
			{ params: { county: "MT" } },
			{ params: { county: "PB" } },
			{ params: { county: "PE" } },
			{ params: { county: "PI" } },
			{ params: { county: "PR" } },
			{ params: { county: "RJ" } },
			{ params: { county: "RN" } },
			{ params: { county: "RO" } },
			{ params: { county: "RS" } },
			{ params: { county: "SC" } },
			{ params: { county: "SE" } },
			{ params: { county: "SP" } },
			{ params: { county: "TO" } },
		],
		fallback: false,
	}
}
