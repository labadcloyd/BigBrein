import Dashboard from '../../components/dashboard/dashboard'
import {getSession} from 'next-auth/client'
import {User} from '../../models/userModel'

//this is the specific folder directory, where you can find all the files inside the folder
export default function FolderPage(props) {
	const {session, userFolders} = props;
	return <Dashboard session={session} userFolders={userFolders} />
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
	/*we get the user and their folders*/
	const user = await User.findOne({username:username})
	const folders = JSON.parse(JSON.stringify(user.folders))
	
	return{
		props:{
			session:session,
			userFolders: folders
		}
	}
}