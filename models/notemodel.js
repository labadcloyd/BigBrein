const mongoose = require("mongoose");

const noteSetSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 1,
		max: 50,
		required:true,
	},
	noteData:{
		type:Object,
		required:true,
	},
	filetype:{
		type: String,
		required:true,
	}
})
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const NoteSet = mongoose.models.NoteSet || mongoose.model('NoteSet', noteSetSchema )

export {NoteSet}