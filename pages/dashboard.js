import Head from 'next/head'
import {getSession} from 'next-auth/client'
//this is the dashboard, where all the study files will be found
export default function Home() {
  
  return (
    <div>
      <h1>Welcome to the dashboard</h1>
    </div>
  )
}

export async function getServerSideProps(context){
	const session = await getSession({req:context.req})
	if(!session){
		return{
			redirect:{
				destination: '/auth'
			}
		}
	}
	console.log(session)
}