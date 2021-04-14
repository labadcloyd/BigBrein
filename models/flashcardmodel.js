const mongoose = require("mongoose");

const flashcardSetSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 1,
		max: 50,
		required:true,
	},
	flashcards:[{term: String, description: String}],
})
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const FlashcardSet = mongoose.models.FlashcardSet || mongoose.model('FlashcardSet', flashcardSetSchema )

export {FlashcardSet}