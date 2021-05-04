import Sidebar from '../../../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../models/usermodel'
import css from './dashboard.module.css'
import {Menu} from '@material-ui/icons'
import FolderWrapper from '../../../components/dashboard/folderWrapper'

//this is the dashboard, where all the study files will be found
export default function DashboardPage(props) {
	
	const {session, userFolders} = props;
	return (
		<>
			<FolderWrapper >
				{session && (
					<label htmlFor="bar-checker" className={css.hamburger}>
						<Menu fontSize="large"/>
					</label>
				)}
				<input type="checkbox" className={css.checker} id="bar-checker"/>
				<div className={css.folderWrapperSidebar}>
					<Sidebar session={session} userFolders={userFolders} />
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
	const user = await User.findOne({username:username})
	/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	return{
		props:{
			session:session,
			userFolders: folders
		}
	}
}