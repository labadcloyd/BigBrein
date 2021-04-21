import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import Style from './sidebar.module.css'
import {AddCircle, Folder} from '@material-ui/icons'
export default function Sidebar(props){
	const router = useRouter();
	const {session, userFolders} = props;
	const [folderTitle, setFolderTitle] = useState('');
	/* for showing the api response when adding a new folder*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* controlling the folder title input */
	function handleChange(event){
		/* clearing any response when adding a new folder*/
		setResponseAvailable(false)
		setFolderTitle(event.target.value)
	}
	/* function that makes the post request */
	async function submitFolder(data){
		try{
			const username = session.user.name
			const response = await axios.post('/api/userFolder', {folderTitle:folderTitle, username: username})
			return response
		}catch(error){
			/* You can only retrieve the json of the res error through adding .response at the end */
			return error.response
		}		
	}
	/* handling submit request */
	async function submitHandler(event){
		event.preventDefault()
		/* checking if input is all just spaces */
		if(folderTitle.trim() === ''){
			setFolderTitle('')
			return
		}
		/* calling the function that sends the post request */
		const response = await submitFolder()
		/* handling the response */
		if(response.status !== 201){
			setResponseAvailable(true)
			setFolderTitle('')
			setResponse(response.data.message)
		}
		if(response.status === 201){
			setFolderTitle('')
			const folderID = response.data.folderID
			router.push(`/files/${folderID}`)
		}
	}
	return(
		<div className={Style.sidebarWrapper}>
			<div className={Style.sidebarContainer}>
				{isApiResponse && (<h2>{apiResponse}</h2>)}
				{userFolders.map((folder, index)=>{
					return(
						<a key={index} className={Style.folderContainer} href={`/files/${folder._id}`}><Folder/> {folder.title}</a>
					)
				})}
			</div>
			<form onSubmit={submitHandler}>
				<div className={Style.addFolderContainer}>
					<input onChange={handleChange} value={folderTitle} placeholder='Add Folder' maxLength='50' required />
					<button type='submit'><AddCircle/></button>
				</div>
			</form>
		</div>
	)
}
