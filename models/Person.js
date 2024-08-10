const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: { type: String, required: true },
    salary: { type: Number, required: true },
    approved: { type: Boolean, required: true },
    trainee: { type: String },
    createdBy: { type: String },
    dataInicio: { type: Date, required: true },
    dataFim: { type: Date, required: true }
});

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
