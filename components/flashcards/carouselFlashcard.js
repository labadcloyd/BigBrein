import { useState } from 'react';
import css from './carouselFlashcard.module.css'
import {ArrowForwardIos, ArrowBackIos} from '@material-ui/icons'

export default function CarouselFlashcard(props){
	/* contents of flashcard */
	const {contents, title} = props;
	/* Carousel set up */
	const [flashcardIndex, setFlashcardIndex]= useState(0);
	function moveRight(){
		if(flashcardIndex>contents.length-2){
			return
		}
		setFlashcardIndex(flashcardIndex+1)
		setFlashcardOpen(false)
	}
	function moveLeft(){
		if(flashcardIndex<1){
			return
		}
		setFlashcardIndex(flashcardIndex-1)
		setFlashcardOpen(false)
	}
	/* flashcard animation */
	const[isFlashcardOpen, setFlashcardOpen]=useState(false)
	function openFlashcard(){
		setFlashcardOpen((prevValue)=>{
			return !prevValue
		})
	}
	return(
		<>
			<div className={css.fileComponentWrapper}>
				<div className={css.flashcardContentWrapper}>
					<h1>{title}</h1>
					<div className={css.carouselWrapper}>
						{contents.map((content, index)=>{
							if(index>flashcardIndex){
								return(
									<div key={index} className={css.flashcardWrapper} style={{transform:"translateX(1000px)"}}>
										<div className={css.flashcardContainer}>
											<div className={css.flashcardTerm}  style={{transform:'translateY(0%)'}} >
												<div className={css.flashcardTermText}>
													{content.term}
												</div>
											</div>
											<div className={css.flashcardDescription}>
												<div className={css.flashcardTermText}>
													{content.description}
												</div>
											</div>
										</div>
									</div>
								)
							}else if(index<flashcardIndex){
								return(
									<div key={index} className={css.flashcardWrapper} style={{transform:"translateX(-1000px)"}}>
										<div className={css.flashcardContainer}>
											<div className={css.flashcardTerm}  style={{transform:'translateY(0%)'}} >
												<div className={css.flashcardTermText}>
													{content.term}
												</div>
											</div>
											<div className={css.flashcardDescription}>
												<div className={css.flashcardTermText}>
													{content.description}
												</div>
											</div>
										</div>
									</div>
								)
							}else if(index===flashcardIndex){
								return(
									<div key={index} className={css.flashcardWrapper} style={{transform:"translateX(0px)"}}>
										<div className={css.flashcardContainer} onClick={openFlashcard} >
											<div className={css.flashcardTerm}  style={{transform:isFlashcardOpen?'translateY(90%)':'translateY(0%)'}} >
												<div className={css.flashcardTermText}>
													{content.term}
												</div>
											</div>
											<div className={css.flashcardDescription}>
												<div className={css.flashcardDescriptionText}>
													{content.description}
												</div>
											</div>
										</div>
									</div>
								)
							}
						})}
					</div>
					<div className={css.moveControls}>
						<button onClick={moveLeft} style={{transform:'rotate(180deg)', transition:'transform 0s'}}><ArrowForwardIos/> </button>
						<div>
							{flashcardIndex+1}
							/
							{contents.length}
						</div>
						<button onClick={moveRight}><ArrowForwardIos/> </button>
					</div>
				</div>	
			</div>
		</>
	)
}