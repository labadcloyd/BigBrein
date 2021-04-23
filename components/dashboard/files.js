import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import css from './files.module.css'
import {AddCircle, LibraryBooks, Subtitles, Style} from '@material-ui/icons'

export default function Files(props){
	const router = useRouter();
	const {currentFolderID, currentFolder, folderFiles} = props;
	const [fileType, setFileType] = useState('');
	/* controlling the file title input */
	function handleSelect(event){
		setFileType(event.target.value)
	}
	/* function that makes the post request */
	async function addFile(){
		router.push(`/files/${fileType}/create${fileType}`)
	}
	/* icons for files */
	const flashcardIcon = <Style/>
	const noteIcon = <LibraryBooks/>
	const quizIcon = <Subtitles/>
	return(
		<div className={css.fileComponentContainer}> 
			<div className={css.selectContainer}>
				<h1>{currentFolder.length>30?<>{currentFolder.slice(0,30)+' ...'}</>:currentFolder}</h1>
			</div>
			<h3>Files:</h3>
			<div className={css.filesContainer}>
				<div className={css.addFileContainer}>
					<div style={{display:'flex', flexDirection:'column', justifyContent:'flex-end'}}>
						<h4 style={{marginLeft:'5px', fontSize:'1.1rem'}}>Add File</h4>
						<select onChange={handleSelect} placeholder='File Type'>
							<option value="" disabled selected>Select file type</option>
							<option value='Flashcard'>Flashcard</option>
							<option value='Note'>Note</option>
							<option value='Quiz'>Quiz</option>
						</select>
					</div>
					<button 
						onClick={(()=>{addFile()})} 
						disabled={!fileType? true: false} 
						style={{backgroundColor:fileType?'#40BFF8':'#3b3b3b'}}>
							<AddCircle/>
					</button>
				</div>
				{folderFiles.map((file, index)=>{
					const title = file.title
					return(
						<a href={`/files/${file.fileType}/${file.fileID}/${currentFolderID}`} className={css.fileContainer} key={index}>
							<p>{title.length>10?<>{title.slice(0,10)+' ...'}</>:title}</p>
							<span>
								{file.fileType==='Flashcard'?<>{flashcardIcon}</>:<></>}
								{file.fileType==='Note'?<>{noteIcon}</>:<></>}
								{file.fileType==='Quiz'?<>{quizIcon}</>:<></>}
								{file.fileType}
							</span>
						</a>
					)
				})}
			</div>
		</div>
	)
}
