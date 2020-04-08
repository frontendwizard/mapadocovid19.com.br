import fetch from "isomorphic-fetch"

const jsonPromise = fetch(
	`https://brasil.io/api/dataset/covid19`
).then((r) => r.json());

export default (req, res) => {
	jsonPromise.then((json) => res.status(200).json({ lastUpdate: json.tables[1].import_date }))
}
