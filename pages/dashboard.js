import Sidebar from '../components/dashboard/sidebar'
import {getSession} from 'next-auth/client'
import {User} from '../models/userModel'
import css from './dashboard.module.css'
import { useState } from 'react'
import {Menu} from '@material-ui/icons'

//this is the dashboard, where all the study files will be found
export default function DashboardPage(props) {
	
	const {session, userFolders} = props;
	/* STYLING PURPOSES ONLY */
	const [displaySidebar, setDisplaySidebar] = useState(true)
	function toggleSidebar(){
		setDisplaySidebar((prevValue)=>{
			return !prevValue
		})
	}
	return (
		<>
			<button className={css.hamburger} onClick={toggleSidebar} style={displaySidebar?{color: '#fff'}:{color: '#40BFF8'}}>
				<Menu fontSize="large"/>
			</button>
			<div className={css.folderWrapper}>
				<div className={css.sidebarWrapper} style={displaySidebar?{transform: 'translateX(0px)'}:{transform: 'translateX(-350px)'}} >
					<Sidebar session={session} userFolders={userFolders} />
				</div>
				<div className={css.fileComponentWrapper} style={displaySidebar?{transform: 'translateX(+300px)'}:{transform: 'translateX(0px)'}}>	
					<div className={css.fileComponentContainer}>
						<h2>Create or open a folder.</h2>
						<p>Open the folder so you can start making flashcards, notes, or quiz sets.</p>
					</div>
				</div>
			</div>
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