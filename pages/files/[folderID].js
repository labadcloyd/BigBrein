import Sidebar from '../../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../../models/userModel'
import Files from '../../components/dashboard/files'
import css from './folderID.module.css'
import { useState } from 'react'
import FolderWrapper from '../../components/dashboard/folderWrapper'

//this is the specific folder directory, where you can find all the files inside the folder
export default function FolderPage(props) {
	const {session, userFolders, currentFolder, folderFiles} = props;

	/* STYLING PURPOSES ONLY */
	const [displaySidebar, setDisplaySidebar] = useState(true)
	function toggleSidebar(){
		setDisplaySidebar((prevValue)=>{
			return !prevValue
		})
	}
	return (
		<>	
			<FolderWrapper displaySidebar={displaySidebar} session={session} onClick={toggleSidebar}>
				<div className={css.sidebarWrapper} style={displaySidebar?{transform: 'translateX(0px)'}:{transform: 'translateX(-350px)'}} >
					<Sidebar session={session} userFolders={userFolders} />
				</div>
				<div className={css.fileComponentWrapper} onClick={displaySidebar?toggleSidebar:null} style={displaySidebar?{paddingLeft: '320px'}:{paddingLeft: '20px'}}>	
					<Files currentFolderID={currentFolder._id}  session={session} currentFolder={currentFolder.title} folderFiles={folderFiles}></Files>
				</div>
			</FolderWrapper>
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
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	const currentFolderUnserialized = folders.find((folder, index) => {
		return folder._id === folderID;
	  });
	const currentFolder = JSON.parse(JSON.stringify(currentFolderUnserialized))
	const files = JSON.parse(JSON.stringify(currentFolder.files))
	return{
		props:{
			session:session,
			userFolders: folders,
			currentFolder: currentFolder,
			folderFiles: files
		}
	}
}