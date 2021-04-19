import Dashboard from '../../components/dashboard/dashboard'
import {getSession} from 'next-auth/client'
import {User} from '../../models/userModel'
import Files from '../../components/dashboard/files'

//this is the specific folder directory, where you can find all the files inside the folder
export default function FolderPage(props) {
	const {session, userFolders, currentFolder, folderFiles} = props;
	return (
		<>
			<Dashboard session={session} userFolders={userFolders} />
			<Files currentFolder={currentFolder} folderFiles={folderFiles}></Files>
		</>
	)
}

export async function getServerSideProps(context){
	const {folderID} = context.query
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
	/* data needs to be serialized by stringifying and parsing*/
	const folders = JSON.parse(JSON.stringify(user.folders))
	const currentFolderUnserialized = folders.find((folder, index) => {
		return folder._id === folderID;
	  });
	const currentFolder = JSON.parse(JSON.stringify(currentFolderUnserialized))
	const files = JSON.parse(JSON.stringify(currentFolder.files))
	console.log(currentFolder)
	return{
		props:{
			session:session,
			userFolders: folders,
			currentFolder: currentFolder,
			folderFiles: files
		}
	}
}