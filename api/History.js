const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HistorySchema = new Schema({
    icon: String,
    name: String,
    city: String,
    country: String,
    countryIcon: String,
    description: String,
    temp: Number,
    humidity: Number,
    pressure: Number,
    date: String,
});

const History = mongoose.model('History', HistorySchema)

module.exports = History