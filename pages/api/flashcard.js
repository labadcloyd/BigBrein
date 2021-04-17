import {FlashcardSet} from '../../models/flashcardModel'

export default async function handler(req, res){
	if(req.method==='GET'){
		console.log(req.query)
		return res.status(201).json({message:'Successfully added flashcard'})
	}
		
	if(req.method==='POST'){
		const {title, flashcards} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!title || !flashcards){
			return res.status(422).send(`Invalid Input: Please try again`);
		}
		else if(title.length > 30){
			return res.status(422).send(`Invalid Input: Title is too long`);
		}
		else if(title && flashcards){
			/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
			const plainDataFlashcards = JSON.parse(JSON.stringify(flashcards))
			const createdFlashcardSet = new FlashcardSet({
				title:title, 
				flashcards:plainDataFlashcards,
				fileType:'flashcard'
			})
			try{
				await FlashcardSet.insertMany(createdFlashcardSet)
				return res.status(201).json({message:'Successfully added flashcard'})
			}
			catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
}