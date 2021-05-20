const mongoose = require("mongoose");

const quizSetSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 1,
		max: 50,
		required:true,
	},
	quizData:[{
		question: String,
		choices: [String],
		answer: String
	}],
	filetype:{
		type: String,
		required:true,
	},
	createdBy:{
		type: String,
		required:true,
	}
}, {
    timestamps: true
})
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const QuizSet = mongoose.models.QuizSet || mongoose.model('QuizSet', quizSetSchema )

export {QuizSet}