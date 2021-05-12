import Sidebar from '../../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../../models/usermodel'
import css from './folderID.module.css'
import {Menu} from '@material-ui/icons'
import FolderWrapper from '../../components/dashboard/folderWrapper'
import Head from 'next/head'

//this is the dashboard, where all the study files will be found
export default function FolderPage(props) {
	
	const {session, userFolders, currentFolderQuery} = props;
	return (
		<>	
			{!currentFolderQuery &&
				<Head>
					<title>BitBrein - Your Best Study App</title>
				</Head>
			}
			{currentFolderQuery &&
				<Head>
					<title>{`${currentFolderQuery.title} | BitBrein`}</title>
				</Head>
			}
			<FolderWrapper >
				{session && (
					<label htmlFor="bar-checker" className={css.hamburger}>
						<Menu fontSize="large"/>
					</label>
				)}
				<input type="checkbox" className={css.checker} id="bar-checker"/>
				<div className={css.folderWrapperSidebar}>
					<Sidebar session={session} userFolders={userFolders} folderQuery={currentFolderQuery}/>
				</div>
				<div className={css.folderOverlay}></div>
				<div className={css.folderWrapperFiles}>
					<div className={css.fileComponentWrapper} >	
						<div className={css.fileComponentContainer}>
							<h2>Create or open a folder.</h2>
							<p>Open the folder on the sidebar and start making flashcards, notes, or quiz sets.</p>
						</div>
					</div>
				</div>
			</FolderWrapper>
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
	/*we get the user and their folders*/
	const query= context.params.folderID;
	const user = await User.findOne({username:username})
	/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	const currentFolderQuery = await folders.find((folder)=>{
		return folder._id === query
	})
	if(!currentFolderQuery){
		return{
			notFound:true
		}
	}
	return{
		props:{
			session:session,
			userFolders: folders,
			currentFolderQuery: currentFolderQuery
		}
	}
}