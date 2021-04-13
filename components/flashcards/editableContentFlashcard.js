import {useState} from 'react'

export default function EditableContentFlashcard(props){
	const {contents} = props;
	/*the contenteditable data needs to seperated from the main value taken from the flashcard array*/
	const [inputValue, setInputValue] = useState({});
	const [inputIndex, setInputIndex] = useState();

	function handleChange(event){
		/* values coming from the content editable div using onInput*/
		const {innerText, dataset} = event.target
		const {index, name} = dataset
		/* which are then stored in a temporary state*/
		setInputValue(innerText)
		setInputIndex(index)
	}
	/*only when the user clicks outside the textarea the values are saved to the flashcard array*/
	function submitData(event){
		if(!inputValue){
			return
		}
		else if(inputValue){
			const inputName = event.target.dataset.name
			/* a props function is called with the value, index, and name as parameters */ 
			props.onChange(inputValue, inputIndex, inputName)
		}
	}
	return(
		<>
			<div>
				{contents.map((content, index)=>{
					return(
						<div key={index} style={{display:'flex', flexDirection:'row'}}>
							<div 
								contentEditable='true'
								suppressContentEditableWarning="true"
								id={`term${index}`} 
								data-index={index} 
								data-name='term' 
								onInput={handleChange} 
								onBlur={submitData}>
									{content.term}
							</div>
							<div 
								contentEditable='true'
								suppressContentEditableWarning="true"
								id={`description${index}`}  
								data-index={index} 
								data-name='description' 
								onInput={handleChange} 
								onBlur={submitData}>
									{content.description}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}