import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'

export default function Files(props){
	const router = useRouter();
	const {folderFiles} = props;
	const [fileType, setFileType] = useState('');
	/* controlling the file title input */
	function handleSelect(event){
		setFileType(event.target.value)
	}
	/* function that makes the post request */
	async function addFile(){
		router.push(`/files/${fileType}/create${fileType}`)
	}
	return(
		<div>
			<div>
				{folderFiles.map((file, index)=>{
					return(
						<div key={index}>
							<p>{file.type}</p>
							<a href={`/files/${file.type}/${file.fileID}`}>{file.title}</a>
						</div>
					)
				})}
				<div>
					<select onChange={handleSelect} placeholder='File Type'>
						<option value="" disabled selected>Select file type</option>
						<option value='Flashcard'>Flashcard</option>
						<option value='Note'>Note</option>
						<option value='Quiz'>Quiz</option>
					</select>
					<button onClick={(()=>{addFile()})} disabled={!fileType? true: false}>Add File</button>
				</div>
			</div>
		</div>
	)
}
