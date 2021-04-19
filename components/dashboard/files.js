import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import { options } from 'next-auth/client';

export default function Files(props){
	const router = useRouter();
	const {session, currentFolder, folderFiles} = props;
	const [fileType, setFileType] = useState('');
	/* for showing the api response when adding a new file*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* controlling the file title input */
	function handleSelect(event){
		console.log(event.target.value)
		/* clearing any response when adding a new file*/
		setResponseAvailable(false)
		setFileType(event.target.value)
	}
	/* function that makes the post request */
	async function submitFile(data){
		try{
			const username = session.user.name
			const response = await axios.post('/api/userFile', {fileType:fileType, username: username, folderID: currentFolder._id})
			return response
		}catch(error){
			/* You can only retrieve the json of the res error through adding .response at the end */
			return error.response
		}		
	}
	/* handling submit request */
	async function submitHandler(event){
		event.preventDefault()
		/* calling the function that sends the post request */
		const response = await submitFile()
		/* handling the response */
		if(response.status !== 201){
			setResponseAvailable(true)
			setFileType('')
			setResponse(response.data.message)
		}
		if(response.status === 201){
			setFileType('')
			const fileID = response.data.fileID
			router.push(`/files/${fileID}`)
		}
	}
	return(
		<div>
			{isApiResponse && (<h2>{apiResponse}</h2>)}
			<form onSubmit={submitHandler}>
				{folderFiles.map((file, index)=>{
					return(
						<div key={index}>
							<a href={`/files/${file.type}/${file._id}`}>{file.title}</a>
						</div>
					)
				})}
				<div>
					<select onChange={handleSelect} placeholder='File Type'>
						<option value="" disabled selected>Select file type</option>
						<option value='flashcard'>Flashcard</option>
						<option value='note'>Note</option>
						<option value='quiz'>Quiz</option>
					</select>
					<button type='submit' disabled={!fileType? true: false}>Add File</button>
				</div>
			</form>
		</div>
	)
}
