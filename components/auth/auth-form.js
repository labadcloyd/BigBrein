import { useState, useRef, useEffect } from 'react';
import classes from './auth-form.module.css';
import axios from 'axios';

function AuthForm() {
	/* for switching to login or to signup */
	const [isLogin, setIsLogin] = useState(true);
	const [credentials, setCredentials] = useState({})
	const [confirmPassword, setConfirmation] = useState()
	const [isConfirmationError, setConfirmationError] = useState()
	/* for showing any errors when submitting data */
	const [isError, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	
	/* for showing any errors when submitting data */
	async function handleChange(event){
		const {id, value} = event.target
		setError('')
		setCredentials((prevInput)=>{
			return({
				...prevInput,
				[id]:value
			})
		})
	}
	/* for confirming password */
	async function handleConfirmation(event){
		const {value} = event.target
		setConfirmation(value)
		setConfirmationError(false)
	}
	/* function for submiting user credentials */
	async function createUser(username, password){
		try{
			const response = await axios.post('/api/auth/signup', {username,password})
			return response
		}catch(error){
			/* You can only retrieve the json of the res error through adding .response at the end */
			return error.response
		}
  	}
	/* Sending the user credentials to the database */
	async function submitHandler(event){
		event.preventDefault()
		/* For Login */
		if(isLogin){

		}
		/* For Signup */
		else if (!isLogin){
			if(confirmPassword !== credentials.password){
				return setConfirmationError(true)
			} else{
				setConfirmationError(false)
			}
			const response = await createUser(credentials.username, credentials.password)
			const data = await response
			if(data.status===422){
				setError(true)
				setErrorMessage(data.data.message)
			}
		}
  	}
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}
  	return (
		<section className={classes.auth}>
			
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<div style={{color:'red'}}> {isError ? [errorMessage] : ''}</div>
					<label htmlFor='username'>Your Username</label>
					<input type='text' id='username' required value={credentials.username} onChange={handleChange} />
				</div>
				<div className={classes.control}>
					<label htmlFor='password'>Your Password</label>
					<input type='password' id='password' required value={credentials.password} onChange={handleChange} />
				</div>
				<div className={classes.control} style={ {display:isLogin ? 'none': 'block'}}>
					<div style={{color:'red'}}> {isConfirmationError ? 'Password does not match' : ''}</div>
					<label htmlFor='password'>Confirm Your Password</label>
					<input type='password' id='confirmPassword' required value={confirmPassword} onChange={handleConfirmation}/>
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