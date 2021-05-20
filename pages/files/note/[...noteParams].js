import Head from 'next/head'
import {getSession} from 'next-auth/client'
import {User} from '../../../models/usermodel' 
import {NoteSet} from '../../../models/notemodel'
import { useState } from 'react'
import css from './note.module.css'
import {Menu} from '@material-ui/icons'
import Sidebar from '../../../components/dashboard/sidebar'
import FolderWrapper from '../../../components/dashboard/folderWrapper'
import ContentNote from '../../../components/notes/contentNote'

export default function NoteSetPage(props){
	const {title, notes, session, userFolders, folderQuery, queryFileID} = props
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
					<ContentNote notes={notes} title={title} />
				</div>
			</FolderWrapper>
		</>
	)
}
export async function getServerSideProps(context){
	/*we get the session by passing the req and checking if it includes a jwt*/
	const session = await getSession({req:context.req})

	/* getting the noteid and/or the currentfolderID */
	const [query, folderQueryID ]= context.params.noteParams;
	/* finding the specific note */
	const specificNoteSet = await NoteSet.findOne({_id:query},(err, foundSet)=>{
			return foundSet
	}) 
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificNoteSet))
	const notes = JSON.parse(JSON.stringify(plainData.noteData.ops))
	if(!specificNoteSet){
		return{
			notFound:true
		}
	}
	if(!session && specificNoteSet){
		return{
			props:{
				title: plainData.title,
				notes: notes,
				queryFileID: plainData._id,
			}
		}
	}

	/*we get the user and their folders and their files only if its confirmed that currentFolderID exists*/
	const username = session.user.name
	const user = await User.findOne({username:username})
	/*  NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const folders = JSON.parse(JSON.stringify(user.folders))
	if (folderQueryID && specificNoteSet && session){
		const folderQuery = await folders.find((folder)=>{
			return folder._id === folderQueryID
		})
		return{
			props:{
				title: plainData.title,
				notes: notes,
				queryFileID: plainData._id,
				session: session,
				userFolders: folders,
				folderQuery: folderQuery
			}
		}
	}
	else if(session && specificNoteSet){
		return{
			props:{
				title: plainData.title,
				notes: notes,
				queryFileID: plainData._id,
				session: session,
				userFolders: folders
			}
		}
	}
}