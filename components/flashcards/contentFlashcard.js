
export default function ContentFlashcard(props){
	const {contents} = props;
	return(
		<>
			<div>
				{contents.map((content, index)=>{
					return(
						<div key={index} style={{display:'flex', flexDirection:'row'}}>
							<input onChange={props.onChange} data-index={index} value={content.term} name='term'></input>
							<input onChange={props.onChange} data-index={index} value={content.description} name='description'></input>
						</div>
					)
				})}
			</div>
		</>
	)
}