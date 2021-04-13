import {useState} from 'react'

export default function EditableContentFlashcard(props){
	const {contents} = props;
	
	const [inputValue, setInputValue] = useState({});
	const [inputIndex, setInputIndex] = useState();

	function handleChange(event){
		
		const {innerText, dataset} = event.target
		const {index, name} = dataset
		
		setInputValue((prevInput)=>{
			return({
				...prevInput,
				[name]:innerText
			})
		})
		setInputIndex(index)
	}
	
	function submitData(event){
		if(!inputValue){
			return
		}
		else if(inputValue){
			const inputName = event.target.dataset.name
			 
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