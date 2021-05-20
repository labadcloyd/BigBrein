import Head from 'next/head'
import {getSession} from 'next-auth/client'
import css from '../styles/index.module.css'
import Footer from '../components/layout/footer'
import {useRouter} from 'next/router'
//This is the homepage, users can search for notes, flashcards and quizes
export default function Home() {
	const router = useRouter()
	function handleClick(){
		router.push('/dashboard')
	}
	return (
		<>
			<Head>
				<title>BigBrein - Your Best Study App</title>
			</Head>
			<div className={css.pageWrapper}>
				<div className={css.HeaderContainer}>
					<div className={css.MainContainer}>
						<div className={css.TitleContainer}>
							<h1>BigBrein</h1>
							<h2>Make learning efficient and easy through flashcards, notes, and quizes</h2>
							<button onClick={handleClick}>Study Now</button>
						</div>
						<div className={css.wallpaperContainer}>

						</div>
					</div>
				</div>
				<Footer/>
			</div>
		</>
	)
}
export async function getServerSideProps(context){
	const session = await getSession({req:context.req})
	if(session){
		return{
			redirect:{
				destination: '/dashboard'
			}
		}
	}
	if(!session)
	return{
		props:{
			message:'No session'
		}
	}

}