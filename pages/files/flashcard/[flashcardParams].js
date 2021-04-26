import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel' 
import {FlashcardSet} from '../../../models/flashcardModel'
import css from './flashcard.module.css'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'
import { useState } from 'react'
import {Menu} from '@material-ui/icons'
import Sidebar from '../../../components/dashboard/sidebar'
import FolderWrapper from '../../../components/dashboard/folderWrapper'

export default function FlashcardSetPage(props){
	const {title, flashcards, session, userFolders} = props
	
	return(
		<>	
			<FolderWrapper >
				{session && (
					<>
						<label for="bar-checker" className={css.hamburger}>
							<Menu fontSize="large"/>
						</label>
						<input type="checkbox" className={css.checker} id="bar-checker"/>
						<div className={css.folderWrapperSidebar} >
							<Sidebar session={session} userFolders={userFolders}/>
						</div>
					</>
				)}
				<div className={css.folderOverlay}></div>
				<div className={css.folderWrapperFiles}>
					<ContentFlashcard contents={flashcards} title={title} />
				</div>
			</FolderWrapper>
		</>
	)
}
export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})

	/* getting the flashcardid and/or the currentfolderID */
	const query= context.params.flashcardParams;
	/* finding the specific flashcard */
	const specificFlashcardSet = await FlashcardSet.findOne({_id:query},(err, foundSet)=>{
			return foundSet
	}) 
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificFlashcardSet))
	
	if(!session && specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
			}
		}
	}
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
	else if(session && specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
				session: session,
				userFolders: folders
			}
		}
	}
}