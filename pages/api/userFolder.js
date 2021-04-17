import {FlashcardSet} from '../../models/flashcardModel'
import {User} from '../../models/userModel'
import {Folder} from '../../models/folderModel'

export default async function handler(req, res){
	if(req.method==='GET'){
		// console.log(req.query)
		// return res.status(201).json({message:'Successfully added flashcard'})
	}
		
	if(req.method==='POST'){
		const {folderTitle, username} = req.body
		if(!folderTitle || folderTitle.length > 50){
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