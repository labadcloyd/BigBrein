import {getSession} from 'next-auth/client'
import {User} from '../../../../models/usermodel' 
import {QuizSet} from '../../../../models/quizmodel'
import Head from 'next/head'
import EditQuiz from '../../../../components/quiz/editQuiz'

export default function EditNotePage(props){
	const {session, userFolders, title, notes, folderQuery, noteID, username} = props
	return(
		<>
			<Head>
				<title>Edit Note Set | BigBrein</title>
			</Head>
			<EditQuiz username={username} session={session} userFolders={userFolders} currentNoteSet={notes} currentNoteTitle={title} currentNoteID={noteID} folderQuery={folderQuery} />
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
	/* getting the QuizID and/or the currentfolderID */
	const [quizQueryID, folderQueryID ]= context.params.quizParams;
	/* finding the specific note */
	const specificQuizSet = await NoteSet.findOne({_id:quizQueryID},(err, foundSet)=>{
		return foundSet
	})
	if(!specificQuizSet){
		return{
			notFound:true
		}
	} 
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificQuizSet))
	/*we get the user and their folders and their files only if its confirmed that currentFolderID exists*/
	const username = session.user.name
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	if (folderQueryID && specificNoteSet && session){
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
					notes: plainData.noteData,
					noteID:plainData._id,
					session: session,
					userFolders: folders,
					folderQuery: folderQuery,
					username: user.username
				}
			}
		}
	}
	else if(session && specificNoteSet){
		return{
			props:{
				title: plainData.title,
				notes: plainData.noteData,
				noteID:plainData._id,
				session: session,
				userFolders: folders,
				username:user.username
			}
		}
	}
}