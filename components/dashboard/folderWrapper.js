import {Menu} from '@material-ui/icons'
import css from './folderWrapper.module.css'

export default function FolderWrapper(props){
	const{session, onClick, displaySidebar}= props
	return(
		<>
			{session && (
				<button className={css.hamburger} onClick={onClick} style={displaySidebar?{color: '#fff'}:{color: '#40BFF8'}}>
					<Menu fontSize="large"/>
				</button>
			)}
			<div className={css.folderWrapper}>
				{props.children}
			</div>
		</>
	)
}