import Head from 'next/head'
import {getSession} from 'next-auth/client'
import Style from '../styles/index.module.css'
import Image from 'next/image'
import {useRouter} from 'next/router'
//This is the homepage, users can search for notes, flashcards and quizes
export default function Home() {
	const router = useRouter()
	function handleClick(){
		router.push('/dashboard')
	}
	return (
		<div>
			<div className={Style.HeaderContainer}>
				<div className={Style.MainContainer}>
					<div className={Style.TitleContainer}>
						<h1>AcadDen</h1>
						<h2>The last study app you'll ever need. Easily create flashcards, notes, and practice quizzes.</h2>
						<button onClick={handleClick}>Study Now</button>
					</div>
					<div className={Style.ImageContainer}>
						<Image src='/images/study.png' width={1000} height={820}></Image>
					</div>
				</div>
			</div>
		</div>
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