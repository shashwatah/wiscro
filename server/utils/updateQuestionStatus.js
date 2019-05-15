function updateQuestionStatus(Question) {
  Question.find({}, (err, questions) => {
    questions.forEach(currentQuestion => {
      var dateClass = new Date();
      //Checking for time difference of 10 mins
      if (dateClass.getTime() - currentQuestion.timeCreated > 60000) {
        currentQuestion.status = "inactive";
        currentQuestion.save();
      }
    });
  });
}

module.exports = {
  updateQuestionStatus
};
