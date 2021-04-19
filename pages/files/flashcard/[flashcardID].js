import {FlashcardSet} from '../../../models/flashcardModel'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'
import Sidebar from '../../../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel'

export default function EventID(props){
	const {title, flashcards, session, userFolders} = props
	return(
		<>
			{session && (<Sidebar session={session} userFolders={userFolders} />)} 
			<div>
				<h1>{title}</h1>
				<ContentFlashcard contents={flashcards} />
			</div>
		</>
	)
}
export async function getServerSideProps(context){
	/* finding the specific flashcard */
	const query = context.params.flashcardID;
	const specificFlashcardSet = await FlashcardSet.findOne({_id:query},(err, foundSet)=>{
			return foundSet
	})
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificFlashcardSet))
	if(!specificFlashcardSet){
		return{
			notFound:true
		}
	}
	if(!session && specificFlashcardSet){
		return{
			props:{
				title:plainData.title,
				flashcards: plainData.flashcards,
			}
		}
	}
	if(session && specificFlashcardSet){
		/*we get the user and their folders and their files if theres a session*/
		const username= session.user.name
		const user = await User.findOne({username:username})
		const folders = JSON.parse(JSON.stringify(user.folders))
		return{
			props:{
				title:plainData.title,
				flashcards: plainData.flashcards,
				session: session,
				userFolders: folders
			}
		}
	}
}