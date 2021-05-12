import {getSession} from 'next-auth/client'
import {User} from '../../../../models/usermodel' 
import {FlashcardSet} from '../../../../models/flashcardmodel'
import EditFlashcard from '../../../../components/flashcards/editFlashcard'
import Head from 'next/head'

export default function CreateFlashcardPage(props){
	const {session, userFolders, title, flashcards, folderQuery, flashcardID, username} = props
	return(
		<>
			<Head>
				<title>Create Flashcard Set | BitBrein</title>
			</Head>
			<EditFlashcard username={username} session={session} userFolders={userFolders} currentFlashcardSet={flashcards} currentFlashcardTitle={title} currentFlashcardID={flashcardID} folderQuery={folderQuery} />
		</>
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
	/* getting the flashcardID and/or the currentfolderID */
	const [flashcardQueryID, folderQueryID ]= context.params.flashcardParams;
	/* finding the specific flashcard */
	const specificFlashcardSet = await FlashcardSet.findOne({_id:flashcardQueryID},(err, foundSet)=>{
		return foundSet
	}) 
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificFlashcardSet))
	/*we get the user and their folders and their files only if its confirmed that currentFolderID exists*/
	const username = session.user.name
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	if(!specificFlashcardSet){
		return{
			notFound:true
		}
	}
	if (folderQueryID && specificFlashcardSet && session){
		const folderQuery = await folders.find((folder)=>{
			return folder._id === folderQueryID
		})
		if(!folderQuery){
			return{
				notFound:true
			}
		}if(folderQuery){
			return{
				props:{
					title: plainData.title,
					flashcards: plainData.flashcards,
					flashcardID:plainData._id,
					session: session,
					userFolders: folders,
					folderQuery: folderQuery,
					username: user.username
				}
			}
		}
	}
	else if(session && specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
				session: session,
				userFolders: folders,
				username:user.username
			}
		}
	}
}