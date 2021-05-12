import AuthForm from '../components/auth/auth-form';
import Head from 'next/head'

function AuthPage() {
  return (
      <>
        <Head>
          <title>Login or Signup to BitBrein</title>
        </Head>
        <AuthForm />
      </>
    );
}

export default AuthPage;