
export default function ContentFlashcard(props){
	const {contents} = props;
	return(
		<>
			<div>
				{contents.map((content)=>{
					return(
						<div style={{display:'flex', flexDirection:'row'}}>
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