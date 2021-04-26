import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel'
import CreateFlashcard from '../../../components/flashcards/createFlashcard'

export default function CreateFlashcardPage(props){
	const {session, userFolders} = props
	return(
		<CreateFlashcard session={session} userFolders={userFolders} />
	)
}
export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})
	if(!session){
		return{
			redirect:{
				destination: '/auth'
			}
		}
	}
	/*we only start gathering the data once confirmed that the user is signed in*/
	const username= session.user.name
	/*we get the user and their folders and their files*/
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	return{
		props:{
			session:session,
			userFolders: folders,
		}
	}
}