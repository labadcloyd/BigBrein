import { useState } from "react";
import CreateFlashcard from '../../../components/flashcards/createFlashcard'
import ContentFlashcard from "../../../components/flashcards/contentFlashcard";
import axios from "axios";

export default function CreateFlashcardPage(){
	const [flashcardValues, setFlashcardValues] = useState([]);
	const [flashcardName, setName] = useState();

	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		})
	}
	async function submitData(){
		await axios.post('/api/flashcard', {title: flashcardName, flashcards:flashcardValues})
		.then((res)=>{console.log(res.data.message)})
		.catch((err)=>{console.log(err);})
		setName('')
		setFlashcardValues([])
	}
	function flashcardNameChange(event){
		setName(event.target.value)
	}
	return(
		<>
			<ContentFlashcard contents={flashcardValues}/>
			<CreateFlashcard onSubmit={getValue}/>
			<input placeholder='Name of Flashcard Set' value={flashcardName} onChange={flashcardNameChange} />
			<button onClick={submitData}>Create FLashcard Set</button>
		</>
	)
}