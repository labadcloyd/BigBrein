import css from './createNote.module.css'
export default function CreateNotePage(){
	return(
		<>
		<div style={{height:'100vh', width:'100vw', display:'flex', justifyContent:'center', alignItems:'center'}}>
			<div style={{height:'100%', width:'100%', maxWidth:'1000px', textAlign:'center', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>	
				<h1>Hello!</h1>
				<p>We can see that you have tried to create a note. That feature is not yet available at the moment as the app takes a lot of time to develop, and currently AcadDen is an Indie App. In the meantime, you can start creating flashcards. Click the link below</p>
				<a className={css.button} href={`/files/Flashcard/createFlashcard`}>Create a Flashcard</a>
			</div>
		</div>
		</>
	)
}