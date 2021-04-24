import css from './contentFlashcard.module.css'

export default function ContentFlashcard(props){
	const {contents, title} = props;
	return(
		<>
			<div className={css.fileComponentWrapper}>	
				<div className={css.flashcardContentWrapper}>
					<h1>{title}</h1>
					{contents.map((content, index)=>{
						return(
							<div key={index} className={css.flashcardContentContainer}>
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
			</div>
		</>
	)
}