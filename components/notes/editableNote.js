import {Component, useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "quill/dist/quill.snow.css"

// export default function EditableNote(props){
// 	const modules = {
// 		toolbar: [
// 			[{ 'size': ['small', false, 'large', 'huge'] }],
// 			['bold', 'italic', 'underline'],
// 			[{'list': 'ordered'}, {'list': 'bullet'}],
// 			[{ 'align': [] }],
// 			[{ 'color': [] }, { 'background': [] }],
// 			['clean']
// 		  ]
// 	}
// 	const formats =[
// 		'size',
// 		'bold', 'italic', 'underline',
// 		'list', 'bullet',
// 		'align',
// 		'color', 'background'
// 	];
// 	const [data, setData] = useState('')

// 	function rteChange(content, delta, source, editor){
// 		setData(editor.getContents())
// 		console.log(data)
// 	}
// 	function handleBlur(){
// 		// props.getData(data)
// 	}
// 	return (
// 		<div className='ql-wrapper'>
// 	        <ReactQuill theme="snow"  modules={modules}
// 				formats={formats} onChange={rteChange}
// 				value={data}
// 				onBlur={handleBlur}
// 			/>
// 	    </div>
// 	)
// }

class RichTextEditor extends Component {
	constructor(props) {
		super(props);

		this.modules = {
			toolbar: [
		      [{ 'size': ['small', false, 'large', 'huge'] }],
		      ['bold', 'italic', 'underline'],
		      [{'list': 'ordered'}, {'list': 'bullet'}],
		      [{ 'align': [] }],
		      [{ 'color': [] }, { 'background': [] }],
		      ['clean']
		    ]
		};

		this.formats = [
		    'size',
		    'bold', 'italic', 'underline',
		    'list', 'bullet',
		    'align',
		    'color', 'background'
	  	];

	  	this.state = {
			data: this.props.currentNote || ''
		}

		this.rteChange = this.rteChange.bind(this);
	}
	rteChange = (content, delta, source, editor) => {
		this.state.data = editor.getContents();
	}
	handleBlur = () => {
		this.props.getData(this.state.data)
	}

	render() {
	    return (
				<div className='ql-wrapper'>
					<ReactQuill theme="snow"
					modules={this.modules}
					formats={this.formats} 
					onChange={this.rteChange}
					defaultValue={this.state.data}
					placeholder='Start typing down your notes...'
					onBlur={this.handleBlur}

					/>
				</div>
	    );
	}

}

export default RichTextEditor;