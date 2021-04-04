import { Fragment, useState } from "react";
import CreateFlashcard from '../../components/flashcards/createFlashcard/createFlashcard'

export default function CreateFlashcardPage(){
	const [inputValue, setInputValue] = useState({});
	const [flashcardValues, setFlashcardValues] = useState([]);
	function handleChange(event){
		const {name, value} = event.target
		setInputValue((prevInput)=>{
			return({
				...prevInput,
				[name]:value
			})
		})
	}
	function handleSubmit(event){
		event.preventDefault()
		setFlashcardValues((prevValue)=>{
			return[...prevValue, inputValue]
		}) 
		console.log(flashcardValues);
	}
	return(
		<Fragment>
			<div>
				{flashcardValues.map((flashcard)=>{
					return(
						<div>
							<div>{flashcard.term}{flashcard.description}</div>
						</div>
					)
				})}
			</div>
			<CreateFlashcard onSubmit={handleSubmit} onChange={handleChange} termValue={inputValue.term} descriptionValue={inputValue.description} />
		</Fragment>
	)
}