import css from './createnote.module.css'
import Head from 'next/head'
import CreateNote from '../../../components/notes/createNote'

export default function CreateNotePage(){
	return(
		<>
			<Head>
				<title>Create Note Set | BitBrein</title>
			</Head>
			<CreateNote />
		</>
	)
}