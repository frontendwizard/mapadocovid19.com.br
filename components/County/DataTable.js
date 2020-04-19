import { useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import { Text } from "@chakra-ui/core"

import leadingSign from "../../utils/leadingSign"
import Table from "../Table"

const DataTable = ({ countyCitiesHistory, cities }) => {
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
				accessor: ({ confirmed, city_ibge_code: ibge }) => {
					const previous = countyCitiesHistory.find(
						(report) => ibge === report.city_ibge_code
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
				accessor: ({ deaths, city_ibge_code: ibge }) => {
					const previous = countyCitiesHistory.find(
						(report) => ibge === report.city_ibge_code
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
				accessor: ({ death_rate: rate }) =>
					rate ? `${Math.round(rate * 1000) / 10}%` : "0%",
				id: "death_rate",
				sortDescFirst: true,
			},
			{
				Header: "população",
				id: "estimated_population_2019",
				// eslint-disable-next-line react/display-name
				accessor: ({ estimated_population_2019: population }) =>
					population.toLocaleString(),
				sortType: customSort,
				sortDescFirst: true,
			},
		],
		[]
	)

	return (
		<Table columns={columns} data={cities.filter((c) => c.state === county)} />
	)
}

export default DataTable
