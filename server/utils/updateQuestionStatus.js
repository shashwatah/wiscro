function updateQuestionStatus(Question) {
  Question.find(
    {
      active: true
    },
    (err, questions) => {
      questions.forEach(currentQuestion => {
        var dateClass = new Date();
        //Checking for time difference of 10 mins
        if (dateClass.getTime() - currentQuestion.timeCreated > 86400000) {
          currentQuestion.active = false;
          currentQuestion.save();
        }
      });
    }
  );
}

module.exports = {
  updateQuestionStatus
};
