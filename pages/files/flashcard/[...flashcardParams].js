import {getSession} from 'next-auth/client'
import {User} from '../../../models/userModel' 
import {FlashcardSet} from '../../../models/flashcardModel'
import css from './flashcard.module.css'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'
import FileSidebar from '../../../components/dashboard/fileSidebar'

export default function FlashcardSetPage(props){
	const {title, flashcards, session, currentFolder, files} = props
	return(
		<>
			<div className={css.folderWrapper}> 
				{currentFolder && (<FileSidebar currentFolder={currentFolder} folderFiles={files} />)} 
				<div className={css.flashcardComponentWrapper}>
					<h1>{title}</h1>
					<ContentFlashcard contents={flashcards} />
				</div>
			</div>
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
	if(!specificFlashcardSet){
		return{
			notFound:true
		}
	}
	if(!session && specificFlashcardSet || specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
			}
		}
	}
}