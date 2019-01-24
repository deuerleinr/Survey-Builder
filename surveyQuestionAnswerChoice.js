import React from "react";
import { withRouter } from "react-router-dom";
import { Input, FormFeedback } from "reactstrap";

class AnswerChoice extends React.Component {
  render() {
    const answerChoices = this.props.answerChoices;
    return (
      <>
        {answerChoices.map(choice => (
          <tr key={choice.Id}>
            <td>
              <Input
                size="3"
                name="answerChoiceValue"
                type="text"
                className="form-control"
                id="answerChoiceValue"
                value={choice.Value}
                valid={choice.LetterIsValid === "has-success"}
                invalid={choice.LetterIsValid === "has-danger"}
                onChange={e => this.props.onChoiceValueChange(choice.Id, e.target.value)}
              />
              <FormFeedback valid>Input valid.</FormFeedback>
              <FormFeedback> Enter one letter or digit. </FormFeedback>
            </td>
            <td>
              <Input
                placeholder="answer choice..."
                size="20"
                name="answerChoiceText"
                type="text"
                className="form-control"
                id="answerChoiceText"
                value={choice.AnswerChoice}
                valid={choice.TextIsValid === "has-success"}
                invalid={choice.TextIsValid === "has-danger"}
                onChange={e => this.props.onChoiceTextChange(choice.Id, e.target.value)}
              />
              <FormFeedback valid>Choice text is valid.</FormFeedback>
              <FormFeedback>May not be blank. Maximum 250 characters.</FormFeedback>
            </td>

            <td>
              <a
                href="#"
                className="danger ml-2"
                onClick={e => {
                  e.preventDefault();
                  this.props.onChoiceDelete(choice.Id);
                }}
              >
                <i className="fa fa-trash font-medium-3  " />
              </a>
            </td>
          </tr>
        ))}
      </>
    );
  }
}
export default withRouter(AnswerChoice);
