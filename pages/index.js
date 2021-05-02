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
	return (
		<>
			<Head>
				<title>AcadDen - Your Best Study App</title>
			</Head>
			<div className={css.HeaderContainer}>
				<div className={css.MainContainer}>
					<div className={css.TitleContainer}>
						<h1>AcadDen</h1>
						<h2>The last study app you'll ever need. Easily create flashcards, notes, and practice quizzes.</h2>
						<button onClick={handleClick}>Study Now</button>
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