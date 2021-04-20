import Head from 'next/head'
import {getSession} from 'next-auth/client'
import Style from '../styles/index.module.css'
import Image from 'next/image'
import {useRouter} from 'next/router'
//This is the homepage, users can search for notes, flashcards and quizes
export default function Home(props) {
	const router = useRouter()
	const {session} = props
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
						<Image src='/images/study.png' width={900} height={750}></Image>
					</div>
				</div>
			</div>
		</div>
	)
}
export async function getServerSideProps(context){
	const session = await getSession({req:context.req})
	return{
		props:{
			session:session
		}
	}

}