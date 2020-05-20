import fetch from "isomorphic-fetch"

const fetchAllReportsByType = async (params: string, dataset = "caso_full") => {
	const { count, next, results: firstPage } = await fetch(
		`https://brasil.io/api/dataset/covid19/${dataset}/data?${params}`
	).then((r) => r.json())

	if (!next) return firstPage

	const reports = [...firstPage]
	const pages = Math.ceil(count / 1000)
	const remainingPages = await Promise.all(
		Array.from(Array(pages - 1).keys()).map((page) =>
			fetch(
				`https://brasil.io/api/dataset/covid19/${dataset}/data?page=${
					page + 2
				}&${params}`
			).then((r) => r.json())
		)
	)
	remainingPages.forEach(({ results }) => reports.push(...results))
	return reports
}

export default fetchAllReportsByType
