import { Provider } from 'next-auth/client';
import Layout from '../components/layout/layout';
import '../styles/globals.css'
import Head from 'next/head'
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="ico" sizes="32x32" href="/images/favicon.ico" />
			</Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
