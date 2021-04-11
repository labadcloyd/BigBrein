
export default function ContentFlashcard(props){
	const {contents} = props;
	return(
		<>
			<div>
				{contents.map((content)=>{
					return(
						<div style={{display:'flex', flexDirection:'row'}}>
							<div contenteditable="true">
								{content.term} - 
							</div>
							<div contenteditable="true">
								{content.description}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}