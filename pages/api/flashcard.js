import {FlashcardSet} from '../../models/flashcardModel'
import {User} from '../../models/userModel'

export default async function handler(req, res){
	if(req.method==='GET'){
		return res.status(201).json({message:'Successfully added flashcard'})
	}
		
	if(req.method==='POST'){
		const {title, flashcards, username, folderID} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!title || !flashcards || title.length>50){
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
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$push: {"folders.$.files": {fileID: createdFlashcardSet._id,  type:'Flashcard', title:title} } })
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