import {useState} from 'react'

export default function CreateFlashcard(props){
	const items = props.items
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
			<form onSubmit={handleSubmit}>
				<input type='text' value={inputValue.term} name='term' onChange={handleChange} placeholder='term' />
				<input type='text' value={inputValue.description} name='description' onChange={handleChange} placeholder='description' />
				<button type='submit'>Add</button>
			</form>
		</>
	)
}