import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import Style from './files.module.css'
import {AddCircle} from '@material-ui/icons'

export default function Files(props){
	const router = useRouter();
	const {currentFolder,folderFiles} = props;
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
		<div className={Style.fileComponentWrapper}>
			<div className={Style.selectContainer}>
				<h1>{currentFolder}</h1>
				<div>
					Add File
					<select onChange={handleSelect} placeholder='File Type'>
						<option value="" disabled selected>Select file type</option>
						<option value='Flashcard'>Flashcard</option>
						<option value='Note'>Note</option>
						<option value='Quiz'>Quiz</option>
					</select>
					<button onClick={(()=>{addFile()})} disabled={!fileType? true: false}><AddCircle/></button>
				</div>
			</div>
			<h3>Files</h3>
			<div className={Style.filesContainer}>
				
				{folderFiles.map((file, index)=>{
					const title = file.title
					return(
						<a href={`/files/${file.type}/${file.fileID}`} className={Style.fileContainer} key={index}>
							<p>{title.length>16?<>{title.slice(0,16)+'...'}</>:title}</p>
							<span>{file.fileType}</span>
						</a>
					)
				})}
			</div>
		</div>
	)
}
