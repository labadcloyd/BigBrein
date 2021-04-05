import { useState } from "react";
import CreateFlashcard from '../../components/flashcards/createFlashcard/createFlashcard'

export default function CreateFlashcardPage(){
	const [flashcardValues, setFlashcardValues] = useState([]);
	
	function getValue(inputValue){
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		}) 
	}
	return(
		<>
			<div>
				{flashcardValues.map((flashcard)=>{
					return(
						<div>
							<div>{flashcard.term}{flashcard.description}</div>
						</div>
					)
				})}
			</div>
			<CreateFlashcard onSubmit={getValue} />
		</>
	)
}