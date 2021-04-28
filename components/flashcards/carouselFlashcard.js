import { useState } from 'react';
import css from './carouselFlashcard.module.css'

export default function CarouselFlashcard(props){
	const {contents} = props;
	const [flashcardIndex, setFlashcardIndex]= useState(0);
	function moveRight(){
		if(flashcardIndex>contents.length-2){
			return
		}
		console.log(flashcardIndex, contents.length)
		setFlashcardIndex(flashcardIndex+1)
	}
	function moveLeft(){
		if(flashcardIndex<1){
			return
		}
		console.log(flashcardIndex, contents.length)
		setFlashcardIndex(flashcardIndex-1)
	}
	return(
		<>
			<div className={css.fileComponentWrapper}>
				<div className={css.flashcardContentWrapper}>
					<div className={css.carouselWrapper}>
						{contents.map((content, index)=>{
							if(index>flashcardIndex){
								return(
									<div key={index} className={css.flashcard} style={{transform:"translateX(1000px)"}}>
										<div>
											{content.term}
										</div>
										<div>
											{content.description}
										</div>
									</div>
								)
							}else if(index<flashcardIndex){
								return(
									<div key={index} className={css.flashcard} style={{transform:"translateX(-1000px)"}}>
										<div>
											{content.term}
										</div>
										<div>
											{content.description}
										</div>
									</div>
								)
							}else if(index===flashcardIndex){
								return(
									<div key={index} className={css.flashcard} style={{transform:"translateX(0px)"}}>
										<div>
											{content.term}
										</div>
										<div>
											{content.description}
										</div>
									</div>
								)
							}
						})}
					</div>
					<div style={{display:'flex'}}>
						<button onClick={moveLeft}>{'<'}</button>
						<div>
							{flashcardIndex+1}
							/
							{contents.length}
						</div>
						<button onClick={moveRight}>{'>'}</button>
					</div>
				</div>	
			</div>
		</>
	)
}