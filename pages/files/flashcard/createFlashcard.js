import { useState } from "react";
import CreateFlashcard from '../../../components/flashcards/createFlashcard'
import EditableContentFlashcard from "../../../components/flashcards/editableContentFlashcard";
import axios from "axios";
import Dashboard from '../../../components/dashboard/sidebar';
import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel'
import {useRouter} from 'next/router'

export default function CreateFlashcardPage(props){
	const router = useRouter()
	/* getting the user information from the session props */
	const {session, userFolders} = props
	/* for showing the api response when adding a new flashcard*/
	const [apiResponse, setResponse] = useState('');
	const [isApiResponse, setResponseAvailable] = useState(false);
	/* array of all flashcards */
	const [flashcardValues, setFlashcardValues] = useState([]);
	/* title of flashcards */
	const [flashcardTitle, setName] = useState();
	/* title of folder to be saved in */
	const [folderID, setFolderID] = useState('');
	/* controlling the file title input */
	function handleSelect(event){
		setFolderID(event.target.value)
	}
	/* adding flashcardSet name */
	function flashcardNameChange(event){
		setName(event.target.value)
	}
	/* adding a flashcard */
	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		})
	}
	/*changing flashcardset data */
	function changeFlashcardData(inputValue, inputIndex, inputName){
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
	async function postData(){
		try{
			if(!flashcardTitle || !flashcardValues || !folderID){
				return
			}
			const username = session.user.name
			const response = await axios.post('/api/flashcard', {title: flashcardTitle, flashcards:flashcardValues, folderID: folderID, username:username})
			const query = response.data.flashcardID 
			router.push(`/files/Flashcard/${query}`)
		}
		catch(error){
			const errorData = error.response
			const response = errorData.data.message
			setResponse(response)
			setResponseAvailable(true)
		}
	}
	return(
		<div style={{display:'flex', flexDirection:'row'}}>	
			<Dashboard session={session} userFolders={userFolders} />
			<div>
				{isApiResponse && (<h2>{apiResponse}</h2>)}
				<div>
					<input placeholder='Name of Flashcard Set' value={flashcardTitle} onChange={flashcardNameChange} maxLength="50" required />
					<select onChange={handleSelect} placeholder='File Type' required>
						<option value="" disabled selected>Select where to save</option>
						{userFolders.map((folder, index)=>{
							return <option value={folder._id}>{folder.title}</option>
						})}
					</select>
					<button onClick={postData}>Save FLashcard Set</button>
				</div>
				<EditableContentFlashcard onChange={changeFlashcardData} handleDelete={deleteFlashcard} contents={flashcardValues}/>
				<CreateFlashcard onSubmit={getValue}/>
			</div>
		</div>
	)
}
export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})
	if(!session){
		return{
			redirect:{
				destination: '/auth'
			}
		}
	}
	/*we only start gathering the data once confirmed that the user is signed in*/
	const username= session.user.name
	/*we get the user and their folders and their files*/
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	return{
		props:{
			session:session,
			userFolders: folders,
		}
	}
}