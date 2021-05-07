import { useEffect, useState } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import css from './sidebar.module.css'
import {AddCircle, Folder, ExpandMore, LibraryBooks, Subtitles, Style } from '@material-ui/icons'

export default function Sidebar(props){
	const router = useRouter();
	const {session, userFolders, folderQuery, currentFolderQuery} = props;
	const [folderTitle, setFolderTitle] = useState('');
	/* for showing the api response when adding a new folder*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	
	/* BACK END */

	/* function that makes the post request for adding a folder*/
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
	/* state for checking the function if its running */
	const [isSubmitLoading, setSubmitLoading] = useState(false)
	async function submitHandler(event){
		try{
			event.preventDefault()
			if(isSubmitLoading===true){
				return
			}
			setSubmitLoading(true)
			/* checking if input is all just spaces */
			if(folderTitle.trim() === ''){
				setFolderTitle('')
				return
			}
			/* calling the function that sends the post request */
			const response = await submitFolder()
			/* handling the response */
			if(response.status === 201){
				setFolderTitle('')
				const folderID = response.data.folderID
				router.push(`/files/${folderID}`)
				setSubmitLoading(false)
			}
		}catch(error){
			setSubmitLoading(false)
			setResponseAvailable(true)
			setFolderTitle('')
			setResponse(error.response)
		}
	}
	/* function that makes the post request for adding a file*/
	async function addFile(){
		router.push(`/files/${filetype}/create${filetype}`)
	}

	/* FRONT END */

	/* showing the addfile div */
	const [showAddFile, setShowAddFile] = useState(false)
	const [filetype, setFileType] = useState();
	/* controlling the file title input */
	function handleSelect(event){
		setFileType(event.target.value)
	}
	/* icons for files */
	const flashcardIcon = <Style fontSize="small"/>
	const noteIcon = <LibraryBooks fontSize="small"/>
	const quizIcon = <Subtitles fontSize="small"/>
	/* controlling the folder title input */
	function handleChange(event){
		/* clearing any response when adding a new folder*/
		setResponseAvailable(false)
		setFolderTitle(event.target.value)
	}
	/* showing or hiding folder options */
	const [isOptionShown, toggleOption] = useState(false)
	/* changing current folder of sidebar */
	const [currentFolder, setCurrentFolder] = useState('Select or Add Folder')
	function changeFolder(folder){
		setCurrentFolder(folder.title)
		setCurrentFiles(folder.files)
		setfileFolder(folder._id)
		toggleOption(false)
		setShowAddFile(true)
	}
	/* changing current files of sidebar */
	const [currentFiles, setCurrentFiles] = useState([])
	/* adding folder id to file link */
	const [fileFolderID, setfileFolder] = useState()
	/* checking if queried folder is available */
	useEffect(()=>{
		if(folderQuery){
			changeFolder(folderQuery)
		}
	},[])
	if(currentFolderQuery){
		useEffect(()=>{
			const queriedFolder = userFolders.find((folder)=>{
				return folder._id === currentFolderQuery._id
			})
			setCurrentFolder(queriedFolder.title)
			setCurrentFiles(queriedFolder.files)
			toggleOption(false)
			setShowAddFile(true)
		},[currentFolderQuery])
	}
	
	return(
		<>	
			<div className={css.sidebarWrapper}>
				<div className={css.sidebarContainer}>
					<div className={css.optionTitle} onClick={()=>{toggleOption((prevValue)=>{return !prevValue})}} style={{backgroundColor:isOptionShown?'#294481':'#19274e'}}>
						<Folder/>
						<span>{currentFolder}</span>
						<ExpandMore/>
					</div>
					<div className={css.optionWrapper} style={{display:isOptionShown?'block':'none'}}>
						<div className={css.optionContainer}>
							{isApiResponse && (<h2>{apiResponse}</h2>)}
							<form onSubmit={submitHandler}>
								<div className={css.addFolderContainer}>
									<input onChange={handleChange} value={folderTitle} placeholder='Create Folder' maxLength='30' required />
									<button type='submit' disabled={isSubmitLoading?true:false} style={{color:isSubmitLoading?'#3b3b3b':'#ffffff'}}><AddCircle/></button>
								</div>
							</form> 
							{userFolders.map((folder, index)=>{
								const title = folder.title
								return(
									<a key={index} className={css.folderContainer} onClick={()=>{changeFolder(folder)}}>
										<Folder/>
										<span>{title}</span>
									</a>
								)
							})}
						</div>
					</div>

					<div className={css.fileWrapper} style={{display:isOptionShown?'none':'block'}}>
						<div style={{display:showAddFile?'flex':'none', fontWeight:'bold', padding:'10px 0px 15px 0px'}}>
							Add File
						</div>
						<div className={css.selectContainer} style={{display:showAddFile?'flex':'none'}}>
							<select onChange={handleSelect} placeholder='File Type'>
								<option value="" disabled selected>Select file type to add</option>
								<option value='flashcard'>Flashcard</option>
								<option value='note'>Note</option>
								<option value='quiz'>Quiz</option>
							</select>
							<button onClick={addFile} style={{backgroundColor:filetype?'#40BFF8':'#3b3b3b'}} disabled={!filetype? true: false}><AddCircle/></button>
						</div>
						<div className={css.filesContainer}>
							{currentFiles.map((file, index)=>{
								const title = file.title
								return(
									<a key={index} className={css.fileContainer} href={`/files/${file.filetype}/${file.fileID}/${fileFolderID}`}>
										<span>{title}</span>
										<div>
											{file.filetype==='flashcard'?<>{flashcardIcon}</>:<></>}
											{file.filetype==='note'?<>{noteIcon}</>:<></>}
											{file.filetype==='quiz'?<>{quizIcon}</>:<></>}
											{file.filetype}
										</div>
									</a>
								)
							})}
						</div>
					</div>

				</div>
			</div>
		</>
	)
}
