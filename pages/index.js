import Head from 'next/head'
import {getSession} from 'next-auth/client'
import css from '../styles/index.module.css'
import Image from 'next/image'
import {useRouter} from 'next/router'
//This is the homepage, users can search for notes, flashcards and quizes
export default function Home() {
	const router = useRouter()
	function handleClick(){
		router.push('/user/account/dashboard')
	}
	const d = new Date();
	const year = d.getFullYear();
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
							<h2>The last study app you'll ever need. Easily create flashcards, notes, and practice quizzes.</h2>
							<button onClick={handleClick}>Study Now</button>
						</div>
					</div>
				</div>
				<div className={css.footerContainer}>
					<div>
						<h1>©{year} BigBrein </h1>
						<p>Designed and Developed by: <a href='https://github.com/labadcloyd'>Cloyd Abad</a></p>
					</div>
				</div>
			</div>
		</>
	)
}
export async function getServerSideProps(context){
	const session = await getSession({req:context.req})
	if(session){
		return{
			redirect:{
				destination: '/user/account/dashboard'
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