import { useMemo } from "react"
import { Text, Box, Icon } from "@chakra-ui/core"
import { useTable, useSortBy } from "react-table"

const Table = ({ columns, data }) => {
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
			initialState: {
				sortBy: useMemo(
					() => [{ id: "last_available_confirmed", desc: true }],
					[]
				),
			},
		},
		useSortBy
	)
	return (
		<Box overflowX="scroll" maxHeight={[350, 475, 600]} position="relative">
			<Box
				as="table"
				rounded="md"
				shadow="md"
				w="100%"
				style={{ borderCollapse: "collapse" }}
				{...getTableProps()}
			>
				<thead>
					{headerGroups.map((headerGroup) => (
						// eslint-disable-next-line react/jsx-key
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								// eslint-disable-next-line react/jsx-key
								<Box
									as="th"
									position="sticky"
									top={0}
									px={5}
									py={3}
									bg="gray.100"
									borderBottom="2px"
									borderColor="gray.200"
									textAlign="left"
									{...column.getHeaderProps(column.getSortByToggleProps())}
								>
									<Box display="flex">
										<Text
											as="span"
											color="gray.600"
											size="xs"
											textTransform="uppercase"
											letterSpacing="wider"
											width="auto"
											height="auto"
											mr={column.isSorted ? 2 : 6}
										>
											{column.render("Header")}
										</Text>
										{column.isSorted && (
											<Icon
												name={
													column.isSortedDesc ? "chevron-down" : "chevron-up"
												}
											/>
										)}
									</Box>
								</Box>
							))}
						</tr>
					))}
				</thead>
				<tbody {...getTableBodyProps()}>
					{rows.map((row) => {
						prepareRow(row)
						return (
							// eslint-disable-next-line react/jsx-key
							<tr {...row.getRowProps()}>
								{row.cells.map((cell) => {
									return (
										// eslint-disable-next-line react/jsx-key
										<td {...cell.getCellProps()}>
											<Box
												px={5}
												py={2}
												borderBottom="1px"
												borderColor="gray.200"
											>
												<Text m={0} isTruncated>
													{cell.render("Cell")}
												</Text>
											</Box>
										</td>
									)
								})}
							</tr>
						)
					})}
				</tbody>
			</Box>
		</Box>
	)
}

export default Table
