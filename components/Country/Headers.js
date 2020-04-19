import Head from "next/head"

const Headers = () => {
	return (
		<Head>
			<meta
				name="description"
				content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
			/>
			{/* twitter tags */}
			<meta name="twitter:title" content="Mapa do COVID-19 no Brasil" />
			<meta
				name="twitter:description"
				content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
			/>
			<meta name="twitter:site" content="@frontendwizard" />
			<meta name="twitter:creator" content="@frontendwizard" />
			{/* open graph tags */}
			<meta property="og:type" content="article" />
			<meta property="og:title" content="Mapa do COVID-19 no Brasil" />
			<meta
				property="og:description"
				content="Veja os dados nos estados e cidades brasileiras atualizados várias vezes ao dia."
			/>
			<meta property="og:url" content="https://mapadocovid19.com.br" />
			<meta property="og:site_name" content="mapadocovid19.com.br" />

			<title>Mapa do COVID-19 no Brasil</title>
			<link rel="icon" href="/favicon.ico" />
			<link rel="canonical" href="https://mapadocovid19.com.br/" />
		</Head>
	)
}

export default Headers
