import Link from 'next/link';
import { useSession, signOut } from 'next-auth/client';
import {useRouter, userRouter} from 'next/router'
import classes from './main-navigation.module.css';

export default function MainNavigation() {
  const router = useRouter();
  const [session, loading] = useSession();

  function logoutHandler() {
    signOut();
    return router.push('/auth')
  }

  return (
    <header className={classes.header}>
      <Link href='/'>
        <a>
          <div className={classes.logo}>Acadden</div>
        </a>
      </Link>
      <nav>
        <ul>
          {!session && !loading && (
            <li>
              <Link href='/auth'>Login</Link>
            </li>
          )}
          {session && (
            <li>
              <Link href='/profile'>Profile</Link>
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
  );
}