import Head from 'next/head'
import {getSession} from 'next-auth/client'
//This is the homepage, users can search for notes, flashcards and quizes
export default function Home(props) {
	const {session} = props
	console.log(session)
	return (
		<div>
		<h1>Welcome to Acadden</h1>
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