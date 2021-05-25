import css from './editableContentFlashcard.module.css'
import {useState} from 'react'
import {Clear, AddCircle} from '@material-ui/icons'

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
	/* adding the flashcard to the state */
	const [inputValue, setInputValue] = useState({});
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
		props.onSubmit(inputValue)
		setInputValue({term:'', description:''})
		event.preventDefault();
	}
	return(
		<>
			<div className={css.createFlashcardWrapper}>
				{contents.map((content, index)=>{
					return(
						<div className={css.contentFlashcardWrapper} key={index}>
							<div className={css.contentFlashcardContainer}>
								<div>
									<p>TERM</p>
									<div 
										contentEditable='true'
										suppressContentEditableWarning="true"
										id={`term${index}`} 
										data-index={index} 
										data-name='term'  
										onBlur={submitData}
										className={css.flashcardContent}>
											{content.term}
									</div>
								</div>
								<div>
									<p>DESCRIPTION</p>
									<div 
										contentEditable='true'
										suppressContentEditableWarning="true"
										id={`description${index}`}  
										data-index={index} 
										data-name='description' 
										onBlur={submitData}
										className={css.flashcardContent}>
											{content.description}
									</div>
								</div>
								<div className={css.contentBar}>
									<button className={css.deletebtn} onClick={()=>{handleDelete(index)}}><Clear/></button>
								</div>
							</div>
							<div className={css.flashcardLinebreakContainer}>
								<hr className={css.flashcardLinebreak}></hr>
							</div>
						</div>
					)
				})}
				<form onSubmit={handleSubmit}>
					<div className={css.addbtnContainer}>
						<button className={css.addbtn} type='submit'>Add Flashcard</button>
					</div>
					<div style={{display:'none'}}>
						<div>
							<p>TERM</p>
							<input type='text' autoComplete='off' value={inputValue.term} name='term' onChange={handleChange} placeholder='Term' />
						</div>
						<div>
							<p>DESCRIPTION</p>
							<input type='text' autoComplete='off' value={inputValue.description} name='description' onChange={handleChange} placeholder='Description' />
						</div>
					</div>
				</form>
			</div>
		</>
	)
}