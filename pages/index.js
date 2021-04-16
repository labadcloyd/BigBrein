import Head from 'next/head'
import {useSession} from 'next-auth/client'
import {useRouter} from 'next/router'
//this is the dashboard, where all the study files will be found
export default function Home() {
  const router = useRouter();
  const [session, loading] = useSession();
  console.log(session, loading)
  if(!session){
    console.log('no session')
  }

  return (
    <div>
      <h1>Welcome to the dashboard</h1>
    </div>
  )
}
