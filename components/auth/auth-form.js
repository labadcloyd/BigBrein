import { useState, useRef } from 'react';
import classes from './auth-form.module.css';
import axios from 'axios';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const usernameRef = useRef();
  const passwordRef = useRef();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function createUser(username, password){
	try{
		await axios.post('/api/auth/signup', {username,password})
	} catch(error) {
		console.error(error);
	}
  }
  async function submitHandler(event){
	event.preventDefault()
	const enteredUsername = usernameRef.current.value;
	const enteredPassword = passwordRef.current.value;

	if(isLogin){

	}
	else if (!isLogin){
		await createUser(enteredUsername, enteredPassword)
	}
  }
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='username'>Your Username</label>
          <input type='text' id='username' required ref={usernameRef}/>
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;