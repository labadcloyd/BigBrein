import {User} from '../../../models/userModel'
import {hashPassword} from '../../../utilsServer/hash'

export default async function handler(req, res){
	if(req.method ==='POST'){
		const data = req.body
		const {username, password} = data

		/* basic validation for inputs */
		if(!username ||!password || password.trim().length < 7 ){
			return res.status(422).json({message:'invalid input- password should also be at least 7 characters long.'})
		}
		/* checking for duplicate username */
		const duplicateUser = await User.findOne({username:username},(err, duplicateUser)=>{
			if(duplicateUser){return duplicateUser} else if(!duplicateUser){return null}
		})
		if (duplicateUser){
			return res.status(422).json({message:'Username already taken.'})
		}
		/* hashing password and registering user */
		const hashedPassword = await hashPassword(password)
		try{
			const user = {username:username, password: hashedPassword}
			await User.insertMany(user)
			return res.status(201).json({message:'Successfully signed up'})
		}
		catch (error) {
			console.error(error);
			return res.status(500).send(`Server error`);
		}
	}
}