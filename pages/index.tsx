import { Stack, Flex, Text, Image, Box } from "@chakra-ui/core"
import fetch from "isomorphic-fetch"

import * as Country from "../components/Country"
import Footer from "../components/Footer"
import LastUpdateInfo from "../components/LastUpdateInfo"
import counties from "../utils/counties.json"
import fetchAllReports from "../utils/fetchAllReports"

const Home = ({
	lastReports,
	previousReports,
	lastUpdate,
	reportsByCounty,
	countrySumByDay,
}) => {
	return (
		<>
			<Country.Headers />
			<Stack
				as="main"
				padding={4}
				width={["full", 3 / 4, "700px", "1000px"]}
				maxW="full"
				margin={[0, "auto"]}
				spacing={4}
			>
				<Image
					objectFit="contain"
					h={[24, 32]}
					src="covidnobrasil-wide.svg"
					alt="logo da covidnobrasil.live"
				/>
				<Flex justify="center" align="center" wrap="wrap">
					<Box flexBasis={["100%", "50%"]} mb={[4, 0]} mr={[0, 4]}>
						<Country.Map results={lastReports} />
					</Box>
					<Box flexBasis={["100%", "40%"]}>
						<Country.TotalResults data={countrySumByDay} />
					</Box>
				</Flex>
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<Country.NormalizedConfirmed reportsByCounty={reportsByCounty} />
				<Stack spacing={2}>
					<Text fontSize="lg" color="gray.500">
						Dados por estado:
					</Text>
					<Country.DataTable
						previousReports={previousReports}
						lastReports={lastReports}
					/>
				</Stack>
				<Footer />
			</Stack>
		</>
	)
}

export async function getStaticProps() {
	const reports = await fetchAllReports(`place_type=state`)
	const lastReports = reports.filter(({ is_last: isLast }) => isLast)
	const countrySumByDay = reports.reduce((acc, item) => {
		const index = acc.indexOf(acc.find((i) => i.date === item.date))
		if (index >= 0) {
			acc[index].deaths += item.last_available_deaths
			acc[index].confirmed += item.last_available_confirmed
			acc[index].confirmedPer100k +=
				item.last_available_confirmed_per_100k_inhabitants
		} else {
			acc.push({
				date: item.date,
				deaths: item.last_available_deaths,
				confirmed: item.last_available_confirmed,
				confirmedPer100k: item.last_available_confirmed_per_100k_inhabitants,
			})
		}
		return acc
	}, [])
	const countryNewCasesByDay = countrySumByDay.map((day, i) => {
		const previousDay =
			i !== 0 ? countrySumByDay[i - 1] : { confirmed: 0, deaths: 0 }
		return {
			date: day.date,
			confirmed: day.confirmed - previousDay.confirmed,
			deaths: day.deaths - previousDay.deaths,
		}
	})
	const reportsByCounty = reports.reduce((acc, report) => {
		if (typeof acc[report.state] === "object") {
			acc[report.state].push(report)
		} else {
			acc[report.state] = [report]
		}
		return acc
	}, {})
	const previousReports = counties.map(({ initials }) =>
		reports.find((report) => report.state === initials && !report.is_last)
	)
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	return {
		props: {
			countrySumByDay,
			countryNewCasesByDay,
			reportsByCounty,
			lastReports,
			previousReports,
			lastUpdate: tables[1].import_date,
		},
	}
}

export default Home
