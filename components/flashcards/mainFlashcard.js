export default function MianFlashcard(props){
	const {contents} = props;
	return(
		<>
			<div>
				{contents.map((content, index)=>{
					return(
						<div key={index} style={{display:'flex', flexDirection:'row'}}>
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