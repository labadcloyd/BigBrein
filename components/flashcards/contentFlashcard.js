export default function ContentFlashcard(props){
	const {contents} = props;
	return(
		<>
			<div>
				{contents.map((content, index)=>{
					return(
						<div key={index} style={{display:'flex', flexDirection:'row', gap:'1rem'}}>
							<div>
								{content.term}
							</div>
							<div>
								{content.description}
							</div>
						</div>
					)
				})}
			</div>
		</>
	)
}