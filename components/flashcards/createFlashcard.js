import { useState } from "react";
import EditableContentFlashcard from "./editableContentFlashcard";
import axios from "axios";
import {useRouter} from 'next/router'
import css from './createFlashcard.module.css'
import Sidebar from '../dashboard/sidebar'
import FolderWrapper from '../dashboard/folderWrapper'
import {Menu, Save} from '@material-ui/icons'

export default function CreateFlashcard(props){
	const router = useRouter()
	/* getting the user information from the session props */
	const {session, userFolders} = props
	/* for showing the api response when adding a new flashcard*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* array of all flashcards */
	const [flashcardValues, setFlashcardValues] = useState([{term:'', description:''},{term:'', description:''},{term:'', description:''}]);
	/* title of flashcards */
	const [flashcardTitle, setName] = useState();
	/* title of folder to be saved in */
	const [folderID, setFolderID] = useState('');
	/* controlling the file title input */
	function handleSelect(event){
		setFolderID(event.target.value)
		setResponse('')
		setResponseAvailable(false)
	}
	/* adding flashcardSet name */
	function flashcardNameChange(event){
		setName(event.target.value)
		setResponse('')
		setResponseAvailable(false)
	}
	/* adding a flashcard */
	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		})
	}
	/*changing flashcardset data */
	function changeFlashcardData(inputValue, inputIndex, inputName){
		setResponse('')
		setResponseAvailable(false)
		const newFlashcardSet = [...flashcardValues]
		/* here we look for the object with the index of dataset's index and name of dataset's name	and change its value */
		if(inputValue){
			newFlashcardSet[inputIndex][inputName] = inputValue;
			setFlashcardValues(newFlashcardSet)
		}
	}
	/* deleting the flashcard using its index */
	function deleteFlashcard(flashcardIndex){
		setFlashcardValues((prevFlashcards) => {
			return prevFlashcards.filter((prevFlashcards, index) => {
			  return index !== flashcardIndex;
			});
		});
	}
	/* sending post request to the api */
	/* state for checking the function if its running */
	const [isSubmitLoading, setSubmitLoading] = useState(false)
	async function postData(){
		try{
			if(!flashcardTitle){
				const response = 'Missing Input: No title added'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(!flashcardValues){
				const response = 'Missing Input: No flashcards added'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(!folderID){
				const response = 'Missing Input: Please select a folder to save the flashcard set'
				setResponse(response)
				setResponseAvailable(true)
				return
			}
			if(isSubmitLoading===true){
				return
			}
			setSubmitLoading(true)
			const username = session.user.name
			const response = await axios.post('/api/flashcard', {title: flashcardTitle, flashcards:flashcardValues, folderID: folderID, username:username})
			const query = response.data.flashcardID 
			router.push(`/files/flashcard/${query}/${folderID}`)
		}
		catch(error){
			setSubmitLoading(false)
			const errorData = error.response
			const response = errorData.data.message
			setResponse(response)
			setResponseAvailable(true)
		}
	}
	/* for design purposes only */

	return(
		<FolderWrapper >
			{session && (
				<>
					<label htmlFor="bar-checker" className={css.hamburger}>
						<Menu fontSize="large"/>
					</label>
					<input type="checkbox" className={css.checker} id="bar-checker"/>
					<div className={css.folderWrapperSidebar} >
						<Sidebar session={session} userFolders={userFolders}/>
					</div>
				</>
				)}
			<div className={css.folderOverlay}></div>
			<div className={css.folderWrapperFiles}>
				<div className={css.flashcardComponentWrapper}>
					<div className={css.flashcardComponentContainer}>
						{isApiResponse && (<h2 style={{color:'#f84040', marginBottom:'10px', fontSize:'1rem'}}>{apiResponse}</h2>)}
						<div className={css.optionWrapper}>
							<input placeholder='Name of Flashcard Set' value={flashcardTitle} onChange={flashcardNameChange} maxLength="50" required />
							<select onChange={handleSelect} placeholder='File Type' required>
								<option value="" disabled selected>Select where to save</option>
								{userFolders.map((folder, index)=>{
									return <option value={folder._id}>{folder.title}</option>
								})}
							</select>
							<button onClick={postData} disabled={isSubmitLoading?true:false} style={{backgroundColor:isSubmitLoading?'#3b3b3b':'#40BFF8'}}><Save/>Save</button>
						</div>
						<EditableContentFlashcard onSubmit={getValue} onChange={changeFlashcardData} handleDelete={deleteFlashcard} contents={flashcardValues}/>
					</div>
				</div>
			</div>
		</FolderWrapper>
	)
}