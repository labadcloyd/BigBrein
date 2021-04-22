import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
import {useRouter, userRouter} from 'next/router'
import css from './main-navigation.module.css';

export default function MainNavigation() {
  const router = useRouter();
  const currentRoute = router.pathname
  const [session, loading] = useSession();
  function logoutHandler() {
    signOut();
    return router.push('/auth')
  }

  return (
    <div className={css.headerContainer} style={currentRoute==='/'||currentRoute==='/auth'?{backgroundColor:'transparent'}:{backgroundColor:'#001d30'}}>
      <header className={css.header}>
        <Link href='/'>
          <a>
            <div className={css.logo} style={currentRoute.includes('/dashboard')||currentRoute.includes('/files')?{marginLeft:'20px'}:{marginLeft:'0'}}>AcadDen</div>
          </a>
        </Link>
        <nav>
          <ul>
            {!session && !loading && ( 
              <Link href='/auth'>
                <li className={css.loginButton}>Login</li>
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