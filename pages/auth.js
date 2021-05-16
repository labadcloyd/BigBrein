import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'

function AuthPage() {
  return (
      <>
        <Head>
          <title>Login or Signup to BigBrein</title>
        </Head>
        <AuthForm />
      </>
    );
}

export default AuthPage;

export async function getServerSideProps(context){
	const session = await getSession({req:context.req})

	if(session){
		return{
			redirect:{
				destination: '/user/account/dashboard'
			}
		}
	}
}