import { ClickAwayListener } from '@material-ui/core';
import {MoreVert, Delete, Edit } from '@material-ui/icons'
import { useState, useRef } from 'react'
import css from './filebutton.module.css'

export default function Filebutton(props){
	const {flashcardIcon, noteIcon, quizIcon, title, filetype, fileID, fileFolderID, index} = props
	function handleDelete(){
		
	}
	/* for showing or hiding file button */
	const [showOptions, toggleOption] = useState(false)
	function handleClickAway(){
		toggleOption(false)
	}
	function handleOptionClick(){
		toggleOption((prevValue)=>{
			return !prevValue
		})
	}
	return(
		<ClickAwayListener onClickAway={handleClickAway}>
			<div className={css.fileButtonWrapper} >
				<a key={index} className={css.fileContainer} href={`/files/${filetype}/${fileID}/${fileFolderID}`}>
					<span>{title}</span>
					<div>
						{filetype==='flashcard'?<>{flashcardIcon}</>:<></>}
						{filetype==='note'?<>{noteIcon}</>:<></>}
						{filetype==='quiz'?<>{quizIcon}</>:<></>}
						{filetype}
					</div>
				</a>
				<div className={css.fileOptionWrapper}>
					<a onClick={handleOptionClick} ><MoreVert/></a>
					<div className={css.fileOptionContainer} style={{display:showOptions?'flex':'none'}}>
						<a href={`/files/${filetype}/edit${filetype}/${fileID}/${fileFolderID}`}><Edit/>Edit</a>
						<a onClick={handleDelete}><Delete/>Delete</a>
					</div>
				</div>
			</div>
		</ClickAwayListener>
	)
}