import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel' 
import {FlashcardSet} from '../../../models/flashcardModel'
import css from './flashcard.module.css'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'
import FileSidebar from '../../../components/dashboard/fileSidebar'
import { useState } from 'react'
import {Menu} from '@material-ui/icons'
import FolderWrapper from '../../../components/dashboard/folderWrapper'

export default function FlashcardSetPage(props){
	const {title, flashcards, session, currentFolder, files} = props
	
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
							<FileSidebar currentFolder={currentFolder} folderFiles={files} />
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
	const [query, currentFolderID] = context.params.flashcardParams;
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
	const currentFolderUnserialized = folders.find((folder, index) => {
		return folder._id === currentFolderID;
	});
	if(session && specificFlashcardSet && currentFolderUnserialized){
		const currentFolder = JSON.parse(JSON.stringify(currentFolderUnserialized))
		const files = JSON.parse(JSON.stringify(currentFolder.files))
		return{
			props:{
				title:plainData.title,
				flashcards: plainData.flashcards,
				session: session,
				currentFolder: currentFolder,
				files: files
			}
		}
	}
	else if(!specificFlashcardSet){
		return{
			notFound:true
		}
	}
	else if(!currentFolderUnserialized && specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
			}
		}
	}
}