const mongoose = require("mongoose");

var QuestionSchema = mongoose.Schema({
  creator: {
    ID: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    }
  },
  questionID: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true,
    trim: true,
    minlength: 11
  },
  active: {
    type: Boolean,
    required: true
  },
  timeCreated: {
    type: Number,
    required: true
  },
  totalNumAns: {
    type: Number,
    default: 0
  },
  numYes: {
    type: Number,
    default: 0
  },
  numNo: {
    type: Number,
    default: 0
  },
  perYes: {
    type: Number,
    default: 0
  },
  perNo: {
    type: Number,
    default: 0
  }
});

var Question = mongoose.model("Question", QuestionSchema);

module.exports = {
  Question
};
