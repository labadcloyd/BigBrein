import {getSession} from 'next-auth/client'
import {User} from '../../../../models/usermodel' 
import {NoteSet} from '../../../../models/notemodel'
import EditNote from '../../../../components/notes/editNote'
import Head from 'next/head'

export default function EditNotePage(props){
	const {session, userFolders, title, notes, folderQuery, noteID, username} = props
	return(
		<>
			<Head>
				<title>Edit Note Set | BigBrein</title>
			</Head>
			<EditNote username={username} session={session} userFolders={userFolders} currentNoteSet={notes} currentNoteTitle={title} currentNoteID={noteID} folderQuery={folderQuery} />
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
	/* getting the NoteID and/or the currentfolderID */
	const [noteQueryID, folderQueryID ]= context.params.noteParams;
	/* finding the specific note */
	const specificNoteSet = await NoteSet.findOne({_id:noteQueryID},(err, foundSet)=>{
		return foundSet
	})
	if(!specificNoteSet){
		return{
			notFound:true
		}
	}
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificNoteSet))
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