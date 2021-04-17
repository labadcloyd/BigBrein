import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

export default function Dashboard(props){
	const router = useRouter();
	const {session, userFolders} = props;
	console.log(userFolders)
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
	return(
		<div>
			<h1>Welcome to the dashboard</h1>
			{isApiResponse && (<h2>{apiResponse}</h2>)}
			<form onSubmit={addFolder}>
				{userFolders.map((folder, index)=>{
					return(
						<div key={index}>
							<h3>{folder.title}</h3>
						</div>
					)
				})}
				<div>
					<input onChange={handleChange} value={folderTitle} maxLength="50" required />
					<button type='submit'>Add Folder</button>
				</div>
			</form>
		</div>
	)
}
