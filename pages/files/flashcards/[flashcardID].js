import {FlashcardSet} from '../../../models/flashcardmodel'
import ContentFlashcard from '../../../components/flashcards/contentFlashcard'

export default function EventID(props){
	const {title, flashcards} = props
	return(
		<>
			<h1>{title}</h1>
			<ContentFlashcard contents={flashcards} />
		</>
	)
}
export async function getServerSideProps(context){
	const query = context.params.flashcardID;
	const specificFlashcardSet = await FlashcardSet.findOne({_id:query},(err, foundSet)=>{
			return foundSet
	})
	/* NEXTJS requires data to be POJO (Plain Ol Javascript Object), So the data received should be stringified and then parsed. */
	const plainData = JSON.parse(JSON.stringify(specificFlashcardSet))
	if(!specificFlashcardSet){
		return{
			notFound:true
		}
	}
	if(specificFlashcardSet){
		return{
			props:{
				title:plainData.title,
				flashcards: plainData.flashcards
			}
		}
	}
}