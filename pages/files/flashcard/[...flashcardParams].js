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
	
	/* displaying or hiding sidebar */
	const [displaySidebar, setDisplaySidebar] = useState(true)
	function toggleSidebar(){
		setDisplaySidebar((prevValue)=>{
			return !prevValue
		})
	}
	return(
		<>	
			<FolderWrapper displaySidebar={displaySidebar} session={session} onClick={toggleSidebar}>
				{session && (
					<div className={css.sidebarWrapper} style={displaySidebar?{transform: 'translateX(0px)'}:{transform: 'translateX(-350px)'}} >
						<FileSidebar currentFolder={currentFolder} folderFiles={files} />
					</div>
				)} 
				<div className={css.fileComponentWrapper} onClick={displaySidebar?toggleSidebar:null} style={displaySidebar?{paddingLeft: '320px'}:{paddingLeft: '20px'}}>
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