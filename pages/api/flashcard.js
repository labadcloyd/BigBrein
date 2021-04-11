import {FlashcardItem, FlashcardSet} from '../../models/flashcardmodel'

export default async function handler(req, res){
	const {title, flashcards} = req.body
	console.log(title, flashcards)
	const createdFlashcardItems = flashcards.map((item)=>{
		return new FlashcardItem({
			term:item.term, 
			description:item.description
		})
	})
	const createdFlashcardSet = new FlashcardSet({
		title:title, 
		flashcards:createdFlashcardItems
	})
	try{
		await FlashcardSet.insertMany(createdFlashcardSet)
		return res.status(201).json({message:'Added flashcard'})
	}
	catch (error) {
		console.error(error);
		return res.status(500).send(`Server error`);
	}
}