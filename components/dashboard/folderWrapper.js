import {Menu} from '@material-ui/icons'
import css from './folderWrapper.module.css'

export default function FolderWrapper(props){
	return(
		<>
			<div className={css.folderWrapper}>
				{props.children}
			</div>
		</>
	)
}