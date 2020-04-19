import { Stack, Heading, Text } from "@chakra-ui/core"
import fetch from "isomorphic-fetch"

import * as Country from "../components/Country"
import Footer from "../components/Footer"
import LastUpdateInfo from "../components/LastUpdateInfo"
import counties from "../utils/counties.json"
import fetchAllReports from "../utils/fetchAllReports"

const Home = ({ lastReports, previousReports, lastUpdate }) => {
	return (
		<div className="container">
			<Country.Headers />
			<Stack
				as="main"
				padding={4}
				width={["100%", 3 / 4, "700px"]}
				margin={[0, "auto"]}
				spacing={4}
			>
				<Stack spacing={2}>
					<Heading as="h1" fontSize="2xl" my={0}>
						COVID-19 no Brasil
					</Heading>
					<Text fontSize="lg" color="gray.500" my={0}>
						Selecione um estado para mais detalhes
					</Text>
				</Stack>
				<Country.Map results={lastReports} />
				<LastUpdateInfo lastUpdate={lastUpdate} />
				<Country.TotalResults
					current={lastReports}
					previous={previousReports}
				/>
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
		</div>
	)
}
export async function getStaticProps() {
	const reports = await fetchAllReports(`place_type=state`)
	const lastReports = reports.filter(({ is_last: isLast }) => isLast)
	const countrySumByDay = reports.reduce((acc, report) => {
		if (typeof acc[report.date] === "object") {
			acc[report.date].confirmed += report.confirmed
			acc[report.date].deaths += report.deaths
		} else {
			acc[report.date] = {
				confirmed: report.confirmed,
				deaths: report.deaths,
			}
		}
		return acc
	}, {})
	const previousReports = Object.keys(counties).map((s) =>
		reports.find((report) => report.state === s && !report.is_last)
	)
	const { tables } = await fetch(
		`https://brasil.io/api/dataset/covid19`
	).then((r) => r.json())
	return {
		props: {
			countrySumByDay,
			lastReports,
			previousReports,
			lastUpdate: tables[1].import_date,
		},
	}
}

export default Home
