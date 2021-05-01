import {FlashcardSet} from '../../models/flashcardmodel'
import {User} from '../../models/userModel'
import {Folder} from '../../models/folderModel'
import {getSession} from 'next-auth/client'

export default async function handler(req, res){
	const session = await getSession({req:req})
	if(req.method==='GET'){
		// console.log(req.query)
		// return res.status(201).json({message:'Successfully added flashcard'})
	}
		
	if(req.method==='POST'){
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		const {folderTitle, username} = req.body
		if(!username || !folderTitle || folderTitle.length > 30){
			return res.status(422).json({message:`Invalid Input or Title is Too Long`});
		} else if(folderTitle && username){
			try{
				const folder = await new Folder({title:folderTitle, files:[]})
				/* when trying to push documents to array, make sure to add square bracket on the data */
				const response = await User.findOneAndUpdate({username: username}, {$push: {folders: [folder]} })
				return res.status(201).json({message:'Successfully added folder', folderID: folder._id})
			}
			catch{
				console.error(error);
				return error.response;
			}
		}
	}
}