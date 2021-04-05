import { useState } from "react";
import CreateFlashcard from '../../../../components/flashcards/createFlashcard'
import ContentFlashcard from "../../../../components/flashcards/contentFlashcard";

export default function CreateFlashcardPage(){
	const [flashcardValues, setFlashcardValues] = useState([]);
	
	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		}) 
	}
	return(
		<>
			<ContentFlashcard contents={flashcardValues}/>
			<CreateFlashcard onSubmit={getValue} />
		</>
	)
}