import {getSession} from 'next-auth/client'
import {User} from '../../../../models/usermodel'
import Head from 'next/head'
import CreateNote from '../../../../components/notes/createNote'

export default function CreateNotePage(props){
	const {session, userFolders, folderQuery} = props
	return(
		<>
			<Head>
				<title>Create Notes | BigBrein</title>
			</Head>
			<CreateNote session={session} folderQuery={folderQuery} userFolders={userFolders} />
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
	/*we only start gathering the data once confirmed that the user is signed in*/
	const username= session.user.name
	/*we get the user and their folders and their files*/
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	/* getting the flashcardID and/or the currentfolderID */
	const folderQueryID = context.params.flashcardParams;

	if (folderQueryID && session){
		const folderQuery = await folders.find((folder)=>{
			return folder._id === folderQueryID
		})
		if(!folderQuery){
			return{
				props:{
					session:session,
					userFolders: folders,
				}
			}
		}if(folderQuery){
			return{
				props:{
					session: session,
					userFolders: folders,
					folderQuery: folderQuery
				}
			}
		}
	}
	if(!folderQueryID && session)
	return{
		props:{
			session:session,
			userFolders: folders,
		}
	}
}