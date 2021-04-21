import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
import {useRouter, userRouter} from 'next/router'
import classes from './main-navigation.module.css';

export default function MainNavigation() {
  const router = useRouter();
  const currentRoute = router.pathname
  const [session, loading] = useSession();
  console.log(currentRoute)
  function logoutHandler() {
    signOut();
    return router.push('/auth')
  }

  return (
    <div className={classes.headerContainer} style={currentRoute==='/'||currentRoute==='/auth'?{backgroundColor:'transparent'}:{backgroundColor:'#202020'}}>
      <header className={classes.header}>
        <Link href='/'>
          <a>
            <div className={classes.logo}>AcadDen</div>
          </a>
        </Link>
        <nav>
          <ul>
            {!session && !loading && ( 
              <Link href='/auth'>
                <li className={classes.loginButton}>Login</li>
              </Link> 
            )}
            {session && (
              <li>
                <Link href='/dashboard'>Dashboard</Link>
              </li>
            )}
            {session && (
              <li>
                <Link href='/profile'>{session.user.name}</Link>
              </li>
            )}
            {session && (
              <li>
                <button onClick={logoutHandler}>Logout</button>
              </li>
            )}
          </ul>
        </nav>
      </header>
    </div>
  );
}