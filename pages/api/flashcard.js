import {FlashcardItem, FlashcardSet} from '../../models/flashcardmodel'

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
		/* creating model by mapping through flashcards which when completed, returns an array */
		const createdFlashcardItems = flashcards.map((item)=>{
			return new FlashcardItem({
				term:item.term, 
				description:item.description
			})
		})
		const createdFlashcardSet = new FlashcardSet({
			title:title, 
			flashcards:createdFlashcardItems,
			require:true
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