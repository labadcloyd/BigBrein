import { useState, useRef, useEffect } from 'react';
import classes from './auth-form.module.css';
import axios from 'axios';

function AuthForm() {
	/* for switching to login or to signup */
	const [isLogin, setIsLogin] = useState(true);
	const [credentials, setCredentials] = useState({})
	const [confirmPassword, setConfirmation] = useState()
	const [isConfirmationError, setConfirmationError] = useState(false)
	/* for showing any errors when submitting data */
	const [isUsernameError, setUsernameError] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [isRegisterError, setRegisterError] = useState(false)
	/* for handling input change */
	async function handleChange(event){
		const {id, value} = event.target
		setUsernameError('')
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
	useEffect(()=>{
		if(confirmPassword !== credentials.password){
			setRegisterError(true)
			return setConfirmationError(true)
		} else{
			setRegisterError(false)
			return setConfirmationError(false)
		}
	},[confirmPassword])
	/* for validating username */
	useEffect(()=>{
		const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
		/* Validating only when on registration */
		if(!isLogin){
			if (regexUserName.test(credentials.username)) {
				setRegisterError(false)
				return setUsernameError(false)
			} else {
				setUsernameError(true)
				setErrorMessage('Invalid Username: Special characters are not allowed')
				setRegisterError(true)
			}
		}
	},[credentials.username])
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
			if(errorMessage===true || isConfirmationError===true){
				return
			}
			const response = await createUser(credentials.username, credentials.password)
			const data = await response
			if(data.status===422){
				setUsernameError(true)
				setErrorMessage(data.data.message)
			}
		}
  	}
	/* for clearing data when switching from login to signup vice verse */
	useEffect(()=>{
		setCredentials({username:'', password:''})
	},[isLogin])
	function switchAuthModeHandler() {
		setIsLogin((prevState) => !prevState);
	}
  	return (
		<section className={classes.auth}>
			
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<div style={{color:'red'}}> {isUsernameError ? [errorMessage] : ''}</div>
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
					<button 
						disabled={isRegisterError? 'true' : 'false'} 
						style={{backgroundColor:isRegisterError? '#4a4a4a': '', color:isRegisterError? 'black': '', cursor:isRegisterError? 'not-allowed': 'pointer'}}>
							{isLogin ? 'Login' : 'Create Account'}</button>
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