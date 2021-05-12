import {FlashcardSet} from '../../models/flashcardmodel'
import {User} from '../../models/usermodel'
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
			const validatedFlashcards = plainDataFlashcards.filter((flashcard)=>{
				return flashcard.term.length > 0 || flashcard.description.length > 0
			})
			const createdFlashcardSet = new FlashcardSet({
				title:title, 
				flashcards:validatedFlashcards,
				filetype:'flashcard'
			})
			try{
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$push: {"folders.$.files": {fileID: createdFlashcardSet._id,  filetype:"flashcard", title:title} } })
				await FlashcardSet.insertMany(createdFlashcardSet)
				return res.status(201).json({message:'Successfully added flashcard', flashcardID:createdFlashcardSet._id})
			}catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
	if(req.method==='PATCH'){
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		const {title, flashcards, currentFlashcardID, username, folderID} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!username || !title || !flashcards || title.length>50){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(title && flashcards){
			/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
			const plainDataFlashcards = JSON.parse(JSON.stringify(flashcards))
			const validatedFlashcards = plainDataFlashcards.filter((flashcard)=>{
				return flashcard.term.length > 0 || flashcard.description.length > 0
			})
			try{
				await FlashcardSet.findOneAndUpdate({_id:currentFlashcardID}, {$set:{title:title, flashcards:validatedFlashcards}})
				await User.findOneAndUpdate(
					{username:username}, 
					{"$set": { "folders.$[folder].files.$[file].title": title }}, 
					{"arrayFilters": [ 
						{"folder._id": folderID},
						{"file.fileID": currentFlashcardID} 
					]}
				)
				return res.status(201).json({message:'Successfully updatedflashcard'})
			}catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
	if(req.method==='DELETE'){
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		const {fileID, username, folderID} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!username){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(fileID && folderID && username){
			try{
				await FlashcardSet.findOneAndDelete({_id:fileID})
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$pull: {"folders.$.files": {fileID: fileID} } })
				return res.status(201).json({message:'Successfully deleted flashcard'})
			}catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
}