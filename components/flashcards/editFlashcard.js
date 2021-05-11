import { useState } from "react";
import EditableContentFlashcard from "./editableContentFlashcard";
import axios from "axios";
import {useRouter} from 'next/router'
import css from './editFlashcard.module.css'
import Sidebar from '../dashboard/sidebar'
import FolderWrapper from '../dashboard/folderWrapper'
import {Menu, Save} from '@material-ui/icons'

export default function EditFlashcard(props){
	const router = useRouter()
	/* getting the user information from the session props */
	const {session, userFolders, currentFlashcardSet, currentFlashcardTitle, currentFlashcardID, folderQuery} = props
	/* for showing the api response when adding a new flashcard*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* array of all flashcards */
	const [flashcardValues, setFlashcardValues] = useState(currentFlashcardSet);
	/* title of flashcards */
	const [flashcardTitle, setName] = useState(currentFlashcardTitle);
	/* updating flashcardSet name */
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
			if(isSubmitLoading===true){
				return
			}
			setSubmitLoading(true)
			await axios.patch('/api/flashcard', {title: flashcardTitle, flashcards:flashcardValues, currentFlashcardID:currentFlashcardID})
			// const query = response.data.flashcardID
			router.push(`/files/flashcard/${currentFlashcardID}/${folderQuery._id}`)
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
						<Sidebar session={session} userFolders={userFolders} folderQuery={folderQuery} />
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
							<button onClick={postData} disabled={isSubmitLoading?true:false} style={{backgroundColor:isSubmitLoading?'#3b3b3b':'#40BFF8'}}><Save/>Save</button>
						</div>
						<EditableContentFlashcard onSubmit={getValue} onChange={changeFlashcardData} handleDelete={deleteFlashcard} contents={flashcardValues}/>
					</div>
				</div>
			</div>
		</FolderWrapper>
	)
}