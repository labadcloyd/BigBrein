import { useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import Style from './fileSidebar.module.css'
import {AddCircle, Folder, Menu} from '@material-ui/icons'

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
	const [displaySidebar, setDisplaySidebar] = useState(true)
	function toggleSidebar(){
		setDisplaySidebar((prevValue)=>{
			return !prevValue
		})
	}
	return(
		<>	
			<button className={Style.hamburger} onClick={toggleSidebar}>
				<Menu fontSize="large"/>
			</button>
			<div className={Style.sidebarWrapper} style={displaySidebar?{}:{display:'none'}}>
				<div className={Style.sidebarContainerContainer}>
					<div className={Style.sidebarContainer}>
						{folderFiles.map((file, index)=>{
							const title = file.title
							return(
								<a key={index} className={Style.fileContainer} href={`/files/${file._id}`}>
									<Folder/> 
									{ title.length>10?<>{title.slice(0,10)+'...'}</>:title}
								</a>
							)
						})}
					</div>
				</div>
				<div className={Style.selectContainer}>
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
