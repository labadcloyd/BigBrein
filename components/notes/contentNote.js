import {Component, useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css"
import css from "./contentNote.module.css"

class ContentNote extends Component {
	constructor(props) {
		super(props);
	  	this.state = {
			data: this.props.notes
		}
	}

	render() {
	    return (
			<div className={css.fileComponentWrapper}>	
				<div className={css.noteContentWrapper}>
					<h1>{this.props.title}</h1>
					<div className='ql-content-wrapper'>
						<div className='ql-wrapper'>
							<ReactQuill theme="snow"
							defaultValue={this.state.data}
							readOnly={true}
							/>
						</div>
					</div>
				</div>
			</div>
	    );
	}

}

export default ContentNote;