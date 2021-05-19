import {NoteSet} from '../../models/notemodel'
import {User} from '../../models/usermodel'
import {getSession} from 'next-auth/client'

export default async function handler(req, res){
	const session = getSession({req:req})
	if(req.method==='POST'){
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		const {title, noteData, username, folderID} = req.body
		/* validation: if they dont input a title or flashcard */
		if(!username || !title || !noteData || title.length>50){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(title && noteData){
			/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
			const plainDataNotes = JSON.parse(JSON.stringify(noteData))
			const createdNoteSet = new NoteSet({
				title:title, 
				noteData: plainDataNotes,
				filetype:'note'
			})
			try{
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$push: {"folders.$.files": {fileID: createdNoteSet._id,  filetype:"note", title:title, createdBy:username} } })
				await NoteSet.insertMany(createdNoteSet)
				return res.status(201).json({message:'Successfully added notes', noteID:createdNoteSet._id})
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
		const {title, notes, currentNoteID, username, folderID} = req.body
		/* validation: if they dont input a title or note */
		if(!username || !title || !notes || title.length>50){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(title && notes){
			/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
			const plainDataNotes = JSON.parse(JSON.stringify(notes))
			try{
				await NoteSet.findOneAndUpdate({_id:currentNoteID}, {$set:{title:title, noteData:plainDataNotes, createdBy:username}})
				await User.findOneAndUpdate(
					{username:username}, 
					{"$set": { "folders.$[folder].files.$[file].title": title }}, 
					{"arrayFilters": [ 
						{"folder._id": folderID},
						{"file.fileID": currentNoteID} 
					]}
				)
				return res.status(201).json({message:'Successfully updated note'})
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
		/* validation: if they dont input a title or note */
		if(!username){
			return res.status(422).json({message:`Invalid Input: Please try again`});
		}
		else if(fileID && folderID && username){
			try{
				await NoteSet.findOneAndDelete({_id:fileID})
				await User.findOneAndUpdate({username:username, "folders._id": folderID }, {$pull: {"folders.$.files": {fileID: fileID} } })
				return res.status(201).json({message:'Successfully deleted note'})
			}catch (error) {
				console.error(error);
				return res.status(500).send(`Server error`);
			}
		}
	}
}