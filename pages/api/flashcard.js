import {FlashcardSet} from '../../models/flashcardModel'
import {User} from '../../models/userModel'
import {getSession} from 'next-auth/client'

export default async function handler(req, res){
	const session = getSession({req:req})
	if(req.method==='GET'){
		return res.status(201).json({message:'Successfully added flashcard'})
	}
	if(req.method==='POST'){
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		const {title, flashcards, username, folderID} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!username || !title || !flashcards || title.length>50){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(title && flashcards){
			/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
			const plainDataFlashcards = JSON.parse(JSON.stringify(flashcards))
			console.log(plainDataFlashcards)
			const validatedFlashcards = plainDataFlashcards.filter((flashcard)=>{
				return flashcard.term.length > 0 || flashcard.description.length > 0
			})
			const createdFlashcardSet = new FlashcardSet({
				title:title, 
				flashcards:validatedFlashcards,
				fileType:'flashcard'
			})
			try{
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$push: {"folders.$.files": {fileID: createdFlashcardSet._id,  fileType:'Flashcard', title:title} } })
				await FlashcardSet.insertMany(createdFlashcardSet)
				return res.status(201).json({message:'Successfully added flashcard', flashcardID:createdFlashcardSet._id})
			}
			catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
}