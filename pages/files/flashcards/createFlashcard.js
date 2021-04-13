import { useState } from "react";
import CreateFlashcard from '../../../components/flashcards/createFlashcard'
import EditableContentFlashcard from "../../../components/flashcards/editableContentFlashcard";
import axios from "axios";

export default function CreateFlashcardPage(){
	/* array of all flashcards */
	const [flashcardValues, setFlashcardValues] = useState([]);
	/* title of flashcards */
	const [flashcardTitle, setName] = useState();

	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		})
	}
	/* sending post request to api */
	async function postData(){
		console.log(flashcardValues[0].name)
		await axios.post('/api/flashcard', {title: flashcardTitle, flashcards:flashcardValues})
		.then((res)=>{console.log(res.data.message); setName(''); setFlashcardValues([])})
		.catch((err)=>{console.log(err);})
	}
	/* changing or adding flashcardSet name */
	function flashcardNameChange(event){
		setName(event.target.value)
	}
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
	return(
		<>
			<EditableContentFlashcard onChange={changeFlashcardData} handleDelete={deleteFlashcard} contents={flashcardValues}/>
			<CreateFlashcard onSubmit={getValue}/>
			<input placeholder='Name of Flashcard Set' value={flashcardTitle} onChange={flashcardNameChange} />
			<button onClick={postData}>Save FLashcard Set</button>
		</>
	)
}