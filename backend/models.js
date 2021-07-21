const mongoose = require('mongoose');

const TaskSchema = mongoose.Schema({
    name: String,
    owner: String,
    completed: Boolean,
});

const TaskModel = mongoose.model('Task', TaskSchema);

module.exports = {
    TaskModel
}