import {User} from '../../../models/usermodel'
import {getSession} from 'next-auth/client'

export default async function handler(req, res){
	const session = getSession({req:req})
	if(req.method==='POST'){
		const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
		const {oldusername, newusername} = req.body
		if(!session){
			return res.status(401).json({message:`Unauthorized request`});
		}
		if(!newusername){
			return res.status(422).json({message:'Invalid Input'})
		}
		/* basic validation for username */
		if (!regexUserName.test(newusername)){
			return res.status(422).json({message:'Invalid Input: username has invalid characters'})
		}
		/* checking for duplicate username */
		const duplicateUser = await User.findOne({username:newusername},(err, duplicateUser)=>{
			if(duplicateUser){return duplicateUser} else if(!duplicateUser){return null}
		})
		if (duplicateUser){
			return res.status(422).json({message:'Username already taken.'})
		}
		/* updating username */
		try{
			await User.findOneAndUpdate({username:oldusername}, {$set:{username:newusername}})
			return res.status(201).json({message:'Successfully updated username'})
		}
		catch (error) {
			console.error(error);
			return res.status(500).send(`Server error`);
		}
	}
}