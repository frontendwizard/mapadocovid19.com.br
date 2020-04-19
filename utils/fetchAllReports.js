import fetch from "isomorphic-fetch"

const fetchAllReportsByType = async (params) => {
	const { count, next, results: firstPage } = await fetch(
		`https://brasil.io/api/dataset/covid19/caso/data?${params}`
	).then((r) => r.json())

	if (!next) return firstPage

	const reports = [...firstPage]
	const pages = Math.ceil(count / 1000)
	const remainingPages = await Promise.all(
		Array.from(Array(pages - 1).keys()).map((page) =>
			fetch(
				`https://brasil.io/api/dataset/covid19/caso/data?page=${
					page + 2
				}&${params}`
			).then((r) => r.json())
		)
	)
	remainingPages.forEach(({ results }) => reports.push(...results))
	return reports
}

export default fetchAllReportsByType
