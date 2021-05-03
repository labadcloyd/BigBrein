const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 1,
		max: 50,
		required:true,
	},
	files:[{title:String, filetype:String}],
})
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const Folder = mongoose.models.Folder || mongoose.model('Folder', folderSchema )

export {Folder}