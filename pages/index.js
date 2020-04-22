import { Stack, Heading, Text } from "@chakra-ui/core"
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
}) => {
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
				<Heading as="h1" fontSize="2xl" my={0}>
					COVID-19 no Brasil
				</Heading>
				<Country.TotalResults
					current={lastReports}
					previous={previousReports}
				/>
				<Country.Map results={lastReports} />
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
			reportsByCounty,
			lastReports,
			previousReports,
			lastUpdate: tables[1].import_date,
		},
	}
}

export default Home
