import {getSession} from 'next-auth/client'
import {User} from '../../../models/usermodel' 
import {FlashcardSet} from '../../../models/flashcardmodel'
import { useState } from 'react'
import css from './flashcard.module.css'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'
import {Menu} from '@material-ui/icons'
import Sidebar from '../../../components/dashboard/sidebar'
import FolderWrapper from '../../../components/dashboard/folderWrapper'
import CarouselFlashcard from '../../../components/flashcards/carouselFlashcard'
import Head from 'next/head'

export default function FlashcardSetPage(props){
	const {title, flashcards, session, userFolders, folderQuery, queryFileID} = props
	return(
		<>	
			{!folderQuery &&
				<Head>
					<title>{`${title} | BigBrein`}</title>
				</Head>
			}
			{folderQuery &&
				<Head>
					<title>{`${title} - ${folderQuery.title} | BigBrein`}</title>
				</Head>
			}
			<FolderWrapper >
				{session && (
					<>
						<label htmlFor="bar-checker" className={css.hamburger}>
							<Menu fontSize="large"/>
						</label>
						<input type="checkbox" className={css.checker} id="bar-checker"/>
						<div className={css.folderWrapperSidebar} >
							<Sidebar queryFileID={queryFileID} folderQuery={folderQuery} session={session} userFolders={userFolders}/>
						</div>
					</>
				)}
				<div className={css.folderOverlay}></div>
				<div className={css.folderWrapperFiles} style={{paddingLeft:session?'':'0px'}}>
					<CarouselFlashcard contents={flashcards} title={title} />
					<ContentFlashcard contents={flashcards}/>
				</div>
			</FolderWrapper>
		</>
	)
}
export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})

	/* getting the flashcardid and/or the currentfolderID */
	const [query, folderQueryID ]= context.params.flashcardParams;
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
	if (folderQueryID && specificFlashcardSet && session){
		const folderQuery = await folders.find((folder)=>{
			return folder._id === folderQueryID
		})
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
				queryFileID: plainData._id,
				session: session,
				userFolders: folders,
				folderQuery: folderQuery
			}
		}
	}
	else if(session && specificFlashcardSet){
		return{
			props:{
				title: plainData.title,
				flashcards: plainData.flashcards,
				queryFileID: plainData._id,
				session: session,
				userFolders: folders
			}
		}
	}
}