import Head from 'next/head'
import {getSession} from 'next-auth/client'
import {User} from '../models/userModel'
import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

//this is the dashboard, where all the study files will be found
export default function Dashboard(props) {
	const router = useRouter();
	const {session, userFolders} = props;
	const [folderTitle, setFolderTitle] = useState('');
	/* for showing the api response */
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* controlling the folder title input */
	function handleChange(event){
		/* clearing any response */
		setResponseAvailable(false)
		setFolderTitle(event.target.value)
	}
	async function addFolder(event){
		event.preventDefault()
		const username = session.user.name
		const response = await axios.post('/api/userFolder', {folderTitle:folderTitle, username: username})
		console.log(response)
		if(response.status !== 201){
			setResponseAvailable(true)
			setFolderTitle('')
			setResponse(response.data.message)
		}
		if(response.status === 201){
			const folderID = response.data.folderID
			router.push(`/${folderID}`)
		}
	}
	return (
		<div>
			<h1>Welcome to the dashboard</h1>
			{isApiResponse && (<h2>{apiResponse}</h2>)}
			<form onSubmit={addFolder}>
				<div>
					<input onChange={handleChange} value={folderTitle} maxLength="50" required />
					<button type='submit'>Add Folder</button>
				</div>
				{userFolders.map((folder)=>{
					<div>
						<h3>{folder.title}</h3>
					</div>
				})}
			</form>
		</div>
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
	const folders = user.folders
	return{
		props:{
			session:session,
			userFolders: folders
		}
	}
}