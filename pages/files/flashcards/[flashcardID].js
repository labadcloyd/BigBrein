import {useRouter} from 'next/router'

export default function EventID(){
	return(
		<>

		</>
	)
}
export async function getServerSideProps(context){
	const query = context.params.eventid;
	const specificEvent = await getEventById(query)
	if(!specificEvent){
		return{
			notFound:true
		}
	}
}