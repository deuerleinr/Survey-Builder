import React from "react";
import { Card } from "reactstrap";
import "./surveyQuestionList.css";

class QuestionOnlyInsert extends React.Component {
  render() {
    const questions = this.props.questions;

    return (
      <Card
        className="px-2 py-2 QuestionHover"
        key={questions.id}
        onClick={e => this.props.onQuezClick(questions.id)}
      >
        <h4>{questions.question} </h4>
      </Card>
    );
  }
}
export default QuestionOnlyInsert;
