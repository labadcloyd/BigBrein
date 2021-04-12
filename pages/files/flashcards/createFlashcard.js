import { useState } from "react";
import CreateFlashcard from '../../../components/flashcards/createFlashcard'
import ContentFlashcard from "../../../components/flashcards/contentFlashcard";
import axios from "axios";

export default function CreateFlashcardPage(){
	// all the flashcards
	const [flashcardValues, setFlashcardValues] = useState([]);
	// title of flashcards
	const [flashcardName, setName] = useState();

	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		})
	}
	async function submitData(){
		console.log(flashcardValues[0].name)
		await axios.post('/api/flashcard', {title: flashcardName, flashcards:flashcardValues})
		.then((res)=>{console.log(res.data.message); setName(''); setFlashcardValues([])})
		.catch((err)=>{console.log(err);})
	}
	function flashcardNameChange(event){
		setName(event.target.value)
	}
	function handleChange(event){
		const {value, name, dataset} = event.target
		const index = dataset.index
		const newFlashcardSet = [...flashcardValues]
		// here we look for the object with the index of event index and name of event name	and change its value
		newFlashcardSet[index][name] = value;
		console.log(newFlashcardSet)
		setFlashcardValues(newFlashcardSet)
	}
	return(
		<>
			<ContentFlashcard onChange={handleChange} contents={flashcardValues}/>
			<CreateFlashcard onSubmit={getValue}/>
			<input placeholder='Name of Flashcard Set' value={flashcardName} onChange={flashcardNameChange} />
			<button onClick={submitData}>Create FLashcard Set</button>
		</>
	)
}