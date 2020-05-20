import { useMemo, useCallback } from "react"
import { Text } from "@chakra-ui/core"

import Table from "../Table"
import leadingSign from "../../utils/leadingSign"

const CountiesTable = ({ previousReports, lastReports }) => {
	const customSort = useCallback((rowA, rowB, columnId) => {
		return rowA.original[columnId] - rowB.original[columnId]
	}, [])
	const columns = useMemo(
		() => [
			{ Header: "estado", accessor: "state" },
			{
				Header: "casos",
				id: "last_available_confirmed",
				// eslint-disable-next-line react/display-name
				accessor: ({ last_available_confirmed: confirmed, state }) => {
					const previousConfirmed = previousReports.find(
						(uf) => uf.state === state
					).last_available_confirmed
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
				id: "last_available_deaths",
				// eslint-disable-next-line react/display-name
				accessor: ({ last_available_deaths: deaths, state }) => {
					const previousDeaths = previousReports.find(
						(uf) => uf.state === state
					).last_available_deaths
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
				accessor: ({ last_available_death_rate: death_rate }) =>
					// eslint-disable-next-line camelcase
					death_rate ? `${Math.round(death_rate * 1000) / 10}%` : "0%",
				id: "last_available_death_rate",
				sortDescFirst: true,
			},
		],
		[]
	)
	return <Table columns={columns} data={lastReports} />
}

export default CountiesTable
