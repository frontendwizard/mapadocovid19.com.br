import { useMemo, useCallback } from "react"
import { useRouter } from "next/router"
import { Text } from "@chakra-ui/core"

import Table from "../Table"

const DataTable = ({ cities }) => {
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
				id: "last_available_confirmed",
				accessor: ({ last_available_confirmed: confirmed }) => {
					return (
						<>
							<Text as="span">{confirmed}</Text>
						</>
					)
				},
				sortType: customSort,
				sortDescFirst: true,
			},
			{
				Header: "mortes",
				id: "last_available_deaths",
				accessor: ({ last_available_deaths: deaths }) => {
					return (
						<>
							<Text as="span">{deaths}</Text>
						</>
					)
				},
				sortType: customSort,
				sortDescFirst: true,
			},
			{
				Header: "mortalidade",
				accessor: ({ last_available_death_rate: rate }) =>
					rate ? `${Math.round(rate * 1000) / 10}%` : "0%",
				id: "last_available_death_rate",
				sortDescFirst: true,
			},
			{
				Header: "população",
				id: "estimated_population_2019",
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
