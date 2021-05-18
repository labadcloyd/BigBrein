import { useState } from "react";
import axios from "axios";
import {useRouter} from 'next/router'
import css from './createNote.module.css'
import Sidebar from '../dashboard/sidebar'
import FolderWrapper from '../dashboard/folderWrapper'
import {Menu, Save, ArrowBack, ArrowForward} from '@material-ui/icons'
import EditableNote from './editableNote'

export default function CreateNote(props){
	const router = useRouter()
	/* getting the user information from the session props */
	const {session, userFolders, folderQuery} = props
	/* for showing the api response when adding a new flashcard*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* title of folder to be saved in */
	const [folderID, setFolderID] = useState('');
	/* content of the notes */
	const [noteData, setNoteData] = useState()
	/* controlling the folder id to be saved in */
	function handleSelect(event){
		setFolderID(event.target.value)
		setResponse('')
		setResponseAvailable(false)
	}
	/* title of notes */
	const [noteTitle, SetNoteTitle] = useState()
	/* controlling the title of the note */
	function noteNameChange(event){
		SetNoteTitle(event.target.value)
	}
	/* showing or hiding save options */
	const [showSaveOptions, toggleSaveOptions] = useState(false)
	function handleToggleSaveOptions(){
		toggleSaveOptions((prevValue)=>{
			return !prevValue
		})
	}
	/* getting the notes data when clicking outside the div */
	async function getData(data){
		console.log(data)
		await setNoteData(data)
	}
	/* sending post request to the api */
	/* state for checking the function if its running */
	const [isSubmitLoading, setSubmitLoading] = useState(false)
	async function postData(){
		try{
			if(!noteTitle){
				const response = 'Missing Input: No title added'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(!noteData){
				const response = 'Missing Input: No notes added'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(!folderID){
				const response = 'Missing Input: Please select a folder to save the note set'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(isSubmitLoading===true){
				return
			}
			setSubmitLoading(true)
			const username = session.user.name
			const response = await axios.post('/api/note', {title: noteTitle, noteData:noteData, folderID: folderID, username:username})
			const query = response.data.noteID 
			router.push(`/files/note/${query}/${folderID}`)
		}
		catch(error){
			setSubmitLoading(false)
			const errorData = error.response
			const response = errorData.data.message
			setResponse(response)
			setResponseAvailable(true)
		}
	}

	return(
		<FolderWrapper >
			{session && (
				<>
					<label htmlFor="bar-checker" className={css.hamburger}>
						<Menu fontSize="large"/>
					</label>
					<input type="checkbox" className={css.checker} id="bar-checker"/>
					<div className={css.folderWrapperSidebar} >
						<Sidebar session={session} folderQuery={folderQuery} userFolders={userFolders}/>
					</div>
				</>
				)}
			<div className={css.folderOverlay}></div>
			<div className={css.folderWrapperFiles}>
				<div className={css.flashcardComponentWrapper}>
					<div className={css.flashcardComponentContainer}>
						{isApiResponse && (<h2 style={{color:'#f84040', marginBottom:'10px', fontSize:'1rem'}}>{apiResponse}</h2>)}
						<div className={css.optionWrapperWrapper}>
							<div className={css.optionWrapperWrapperButton} onClick={handleToggleSaveOptions} style={{width:'70px'}}>
								<ArrowForward/>
							</div>
							<div className={css.optionWrapper} style={{display:showSaveOptions?'flex':'none'}}>
								<input placeholder='Title for Notes' value={noteTitle} onChange={noteNameChange} maxLength="50" required />
								<select onChange={handleSelect} placeholder='File Type' required>
									<option key={0} value="" disabled selected>Select where to save</option>
									{userFolders.map((folder, index)=>{
										return <option key={index + 1} value={folder._id}>{folder.title}</option>
									})}
								</select>
								<button onClick={postData} disabled={isSubmitLoading?true:false} style={{backgroundColor:isSubmitLoading?'#3b3b3b':'#40BFF8'}}><Save/>Save</button>
							</div>
							<div className={css.optionWrapperWrapperButton} onClick={handleToggleSaveOptions} style={{display:showSaveOptions?'none':'flex', width:'170px'}}>
								<ArrowBack/> Save Options
							</div>
						</div>
						<EditableNote getData={getData} />
					</div>
				</div>
			</div>
		</FolderWrapper>
	)
}