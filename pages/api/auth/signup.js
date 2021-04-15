import {User} from '../../../models/userModel'
import {hashPassword} from '../../../utilsServer/hash'

export default async function handler(req, res){
	if(req.method ==='POST'){
		const data = req.body
		const {username, password} = data
		console.log(username,password)

		if(!username ||!password || password.trim().length < 7 ){
			res.status(422).json({message:'invalid input- password should also be at least 7 characters long.'})
			return;
		}
		const hashedPassword = await hashPassword(password)
		try{
			const user = {username:username, password: hashedPassword}
			await User.insertMany(user)
			console.log(hashedPassword)
			return res.status(201).json({message:'Successfully signed up'})
		}
		catch (error) {
			console.error(error);
			return res.status(500).send(`Server error`);
		}
	}
}