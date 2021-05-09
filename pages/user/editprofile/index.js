import Sidebar from '../../../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../../../models/usermodel'
import css from './editprofile.module.css'
import {Menu} from '@material-ui/icons'
import FolderWrapper from '../../../components/dashboard/folderWrapper'
import axios from 'axios'
import { useRef, useState } from 'react'

export default function EditProfilePage(props) {
	// const {session, userFolders, username} = props;
	// const [inputUsername, setInputUsername] = useState(username)
	// /* for showing any errors when submitting data */
	// const [confirmPassword, setConfirmedPassword] = useState()
	// const [isConfirmationError, setPasswordError] = useState(false)
	// const [isUsernameError, setUsernameError] = useState(false);
	// const [errorMessage, setErrorMessage] = useState('');
	
	// /* UPDATING THE USERNAME */
	// /* function for updating username */
	// async function updateUsername(oldusername, newusername){
	// 	try{
	// 		const response = await axios.post('/api/account/updateUsername', {oldusername,newusername})
	// 		return response
	// 	}catch(error){
	// 		/* You can only retrieve the json of the res error through adding .response at the end */
	// 		return error.response
	// 	}
	//   }
	// async function handleUsernameUpdate(event){
	// 	event.preventDefault()
	// 	/* not allowing users to sign up if there are errors*/
	// 	if(errorMessage===true || isConfirmationError===true){
	// 		return
	// 	}
	// 	const response = await updateUsername(username, inputUsername)
	// 	if(response.status===422 || response.status===500){
	// 		setUsernameError(true)
	// 		return setErrorMessage(response.data.message)
	// 	}
	// }
	return (
		<>
			{/* <FolderWrapper >
				{session && (
					<label htmlFor="bar-checker" className={css.hamburger}>
						<Menu fontSize="large"/>
					</label>
				)}
				<input type="checkbox" className={css.checker} id="bar-checker"/>
				<div className={css.folderWrapperSidebar}>
					<Sidebar session={session} userFolders={userFolders}/>
				</div>
				<div className={css.folderOverlay}></div>
				<div className={css.folderWrapperFiles}>
					<div className={css.fileComponentWrapper} >	
						<div className={css.fileComponentContainer}>
							<form onSubmit={handleUsernameUpdate}>
								<div style={{color:'red'}}> {isUsernameError ? [errorMessage] : ''}</div>
								<input value={inputUsername} onChange={(event)=>{setInputUsername(event.target.value)}} />
								<button type='submit'>Change Username</button>
							</form>
							<div>
								<h2>Change Password</h2>
							</div>
						</div>
					</div>
				</div>
			</FolderWrapper> */}
		</>
	)
}

export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})
	if(!session){
		return{
			redirect:{
				destination: '/auth'
			}
		}
	}
	/*we only start gathering the data once confirmed that the user is signed in*/
	const username= session.user.name
	/*we get the user and their folders*/
	const user = await User.findOne({username:username})
	/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	const serializedUser = JSON.parse(JSON.stringify(user))
	return{
		props:{
			session:session,
			userFolders: folders,
			username: serializedUser.username
		}
	}
}