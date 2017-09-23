quizPoints  = [];
personalityTypes =
  ["Bold", "Brave", "Calm", "Docile",
  "Hardy", "Hasty", "Impish", "Jolly",
  "Lonely", "Naive", "Quiet", "Quirky",
  "Rash", "Relaxed", "Sassy", "Timid"];

function nextQuestion(n) {
  if (n < questions.length) {
    divQuestion.textContent = questions[n].q;
    divAnswer.innerHTML = "";
    for (var a in questions[n].a){
      //console.log(questions[n].a[a]);
      answer = document.createElement("div");
      divAnswer.append(answer);
      answer.textContent = questions[n].a[a].text;
      answer.onclick = answerClick(questions[n].a[a].points, n);
    }
  } else {
    results();
  }
}

function answerClick(points,n) {
  return function() {
    choose(points);
    nextQuestion(n+1);
  };
}

function choose(points) {
  //console.log(points);
  for (var n in points){
    quizPoints[points[n]-1]++;
  }
}

function begin() {
  divQuestion = document.getElementById("question");
  divAnswer   = document.getElementById("answers" );
  divResults  = document.getElementById("results" );
  document.getElementById("begin").style.display = "none";
  divQuestion.style.display = "block";
  divAnswer.style.display = "block";
  quizPoints  = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  nextQuestion(0);
}

function results() {
  divQuestion.style.display = "none";
  divAnswer.style.display = "none";
  divResults.style.display = "block";
  divResults.textContent = personalityTypes[quizPoints.indexOf(Math.max(...quizPoints))];
}