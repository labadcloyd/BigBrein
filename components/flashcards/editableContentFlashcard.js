import {useState} from 'react'

export default function EditableContentFlashcard(props){
	const {contents} = props;
	/*only when the user clicks outside the textarea the values are saved to the flashcard array*/
	function submitData(event){
		/*!!!CHANGES ARE UNCONTROLLED BY REACT!!!*/
		const {innerText, dataset} = event.target
		const {index, name} = dataset
		if(!innerText){
			return
		}
		else if(innerText){
			/* a props function is called with the value, index, and name as parameters */ 
			props.onChange(innerText, index, name)
		}
	}
	/* a props function is called with index as the parameter to delete a specific flashcard*/ 
	function handleDelete(index){
		props.handleDelete(index)
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
								onBlur={submitData}>
									{content.term}
							</div>
							<div 
								contentEditable='true'
								suppressContentEditableWarning="true"
								id={`description${index}`}  
								data-index={index} 
								data-name='description' 
								onBlur={submitData}>
									{content.description}
							</div>
							<button onClick={()=>{handleDelete(index)}}>Delete</button>
						</div>
					)
				})}
			</div>
		</>
	)
}