const mongoose = require("mongoose");

const flashcardItemSchema = new mongoose.Schema({
	term: {
		type:String,
		required: true,
		min:1
	},
	description: {
		type:String,
		required:true,
		min:1
	}
});
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const FlashcardItem = mongoose.models.FlashcardItem || mongoose.model('FlashcardItem', flashcardItemSchema )
const flashcardSetSchema = new mongoose.Schema({
	title: {
		type: String,
		min: 1,
		required:true,
	},
	flashcards:[flashcardItemSchema],
})
//it is very important to structure the model like this as Nextjs has a bug that creates the model again every render if the model is not done like this
const FlashcardSet = mongoose.models.FlashcardSet || mongoose.model('FlashcardSet', flashcardSetSchema )

export {FlashcardItem, FlashcardSet}