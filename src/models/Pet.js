import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
    name: String,
    type: String,
    age: Number
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet;
