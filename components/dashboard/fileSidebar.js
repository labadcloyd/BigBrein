import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import css from './fileSidebar.module.css'
import {AddCircle, Menu, LibraryBooks, Subtitles, Style} from '@material-ui/icons'

export default function FileSidebar(props){
	const router = useRouter();
	const {currentFolder, folderFiles} = props;
	const [fileType, setFileType] = useState('');
	/* controlling the file title input */
	function handleSelect(event){
		setFileType(event.target.value)
	}
	/* function that makes the post request */
	async function addFile(){
		router.push(`/files/${fileType}/create${fileType}`)
	}

	/* STYLING PURPOSES ONLY */
	/* displaying or hiding sidebar */
	const [displaySidebar, setDisplaySidebar] = useState(true)
	function toggleSidebar(){
		setDisplaySidebar((prevValue)=>{
			return !prevValue
		})
	}
	/* icons for files */
	const flashcardIcon = <Style/>
	const noteIcon = <LibraryBooks/>
	const quizIcon = <Subtitles/>
	return(
		<>	
			<button className={css.hamburger} onClick={toggleSidebar}>
				<Menu fontSize="large"/>
			</button>
			<div className={css.sidebarWrapper} style={displaySidebar?{}:{display:'none'}}>
				<div className={css.sidebarContainerContainer}>
					<div className={css.sidebarContainer}>
						{folderFiles.map((file, index)=>{
							const title = file.title
							return(
								<a key={index} className={css.fileContainer} href={`/files/${file._id}`}>
									{flashcardIcon}
									{ title.length>10?<>{title.slice(0,10)+'...'}</>:title}
								</a>
							)
						})}
					</div>
				</div>
				<div className={css.selectContainer}>
					<div>
						<select onChange={handleSelect} placeholder='File Type'>
							<option value="" disabled selected>Select file type to add</option>
							<option value='Flashcard'>Flashcard</option>
							<option value='Note'>Note</option>
							<option value='Quiz'>Quiz</option>
						</select>
						<button onClick={(()=>{addFile()})} disabled={!fileType? true: false}><AddCircle/></button>
					</div>
				</div>
			</div>
		</>
	)
}
