import {Fragment} from 'react'
export default function CreateFlashcard(props){
	const items = props.items
	return(
		<Fragment>
			{/* <div>
				{items.map((item)=>{
					return(
						<div>
							<span>{item.term}</span>
							<span>{item.description}</span>
						</div>
					)
				})}
			</div> */}
			<form onSubmit={props.onSubmit}>
				<input type='text' value={props.termValue} name='term' onChange={props.onChange} placeholder='term' />
				<input type='text' value={props.descriptionValue} name='description' onChange={props.onChange} placeholder='description' />
				<button type='submit'>Add</button>
			</form>
		</Fragment>
	)
}