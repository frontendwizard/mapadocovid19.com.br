import Head from "next/head"
import { useRouter } from "next/router"

import counties from "../../utils/counties.json"

const Headers = () => {
	const router = useRouter()
	const { county } = router.query
	const { name } = counties.find(({ initials }) => initials === county)
	return (
		<Head>
			<title>Os dados atualizados da COVID-19 no Brasil</title>
			<meta name="title" content="Os dados atualizados da COVID-19 no Brasil" />
			<meta
				name="description"
				content="Acompanhe os dados da COVID-19 no Brasil em cada estado e cidade."
			/>
			<link rel="icon" href="/favicon.ico" />
			<link rel="canonical" href={`https://covidnobrasil.live/${county}`} />

			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://covidnobrasil.live/" />
			<meta
				property="og:title"
				content={`Os dados atualizados da COVID-19 em ${name}`}
			/>
			<meta
				property="og:description"
				content="Acompanhe os dados da COVID-19 no Brasil em cada estado e cidade."
			/>
			<meta property="og:image" content="covidnobrasil.png" />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content="https://covidnobrasil.live/" />
			<meta
				property="twitter:title"
				content="Os dados atualizados da COVID-19 no Brasil"
			/>
			<meta
				property="twitter:description"
				content="Acompanhe os dados da COVID-19 no Brasil em cada estado e cidade."
			/>
			<meta name="twitter:site" content="@frontendwizard" />
			<meta name="twitter:creator" content="@frontendwizard" />
		</Head>
	)
}

export default Headers
