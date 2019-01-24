import React from "react";
import { NotificationManager, NotificationContainer } from "react-notifications";
import AnswerChoice from "./surveyQuestionAnswerChoice";
import "react-notifications/lib/notifications.css";
import {
  getQuestionById,
  surveyQuestionPost,
  surveyQuestionPut,
  surveyQuestionDelete
} from "../../services/surveyQuestion.service";
import { Row, Table, Card, FormGroup, FormFeedback, Label, Col, Input, Button } from "reactstrap";
import Confirmation from "../../shared/Confirmation";
import { withRouter } from "react-router-dom";

class SurveyQuestionEditInsert extends React.Component {
  state = {
    modal: false,
    useModal: false,
    id: "",
    question: "",
    helpText: "",
    isRequired: 0,
    userId: "",
    statusId: "",
    isMultipleAllowed: 0,
    questionTypeId: "",
    sortOrder: "",

    answerChoices: [],
    createPage: false,
    buttonLabel: "Updated",
    headerLabel: "Edit",
    choiceToken: "",
    nextLetter: "",

    validate: {
      questionState: "",
      helpTextState: "",
      userIdState: "",
      statusIdState: "",
      sortOrderState: "",
      questionTypeIdState: ""
    },
    validateChoices: []
  };

  componentWillMount = () => {
    this.loadData();
  };

  loadData = () => {
    if (this.props.match.params.questionId) {
      const questionId = this.props.match.params.questionId;
      getQuestionById(questionId).then(response => {
        let {
          id,
          question,
          helpText,
          isRequired,
          userId,
          statusId,
          isMultipleAllowed,
          questionTypeId,
          sortOrder
        } = response.data.item;

        let ac = JSON.parse(response.data.item.answerChoices);
        let answerChoices = ac.map(bit => {
          bit.LetterIsValid = "";
          bit.TextIsValid = "";
          return bit;
        });

        this.setState({
          id,
          question,
          helpText,
          isRequired,
          userId,
          statusId,
          isMultipleAllowed,
          questionTypeId,
          sortOrder,
          answerChoices
        });
      });
    } else {
      this.setState({ createPage: "true", buttonLabel: "New", headerLabel: "Create" });
    }
  };

  validateInput(e) {
    let regexString;
    let stateValidateName;

    switch (e.target.name) {
      case "question":
        regexString = /^[a-zA-Z0-9.,'!@#$%&?()\s]{3,400}$/;
        stateValidateName = "questionState";
        break;
      case "helpText":
        regexString = /^[a-zA-Z0-9.,'!@#$%&?()\s]{3,400}$/;
        stateValidateName = "helpTextState";
        break;
      case "userId":
        regexString = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        stateValidateName = "userIdState";
        break;
      case "statusId":
        regexString = /^(?=\s*\S).*$/;

        stateValidateName = "statusIdState";
        break;
      case "sortOrder":
        regexString = /^[0-9]{1,3}$/;
        stateValidateName = "sortOrderState";
        break;
      case "questionTypeId":
        regexString = /^(?=\s*\S).*$/;
        stateValidateName = "questionTypeIdState";
        break;
      case "value":
        regexString = /^[a-zA-Z]{1}$/;
        break;
      default:
        regexString = "Ok";
    }

    const validate = {
      ...this.state.validate
    };

    if (regexString !== "Ok") {
      if (regexString.test(e.target.value)) {
        validate[stateValidateName] = "has-success";
      } else {
        validate[stateValidateName] = "has-danger";
      }
    }
    this.setState({ validate });
  }

  firstTwoChoices = () => {
    //create two choices, a and b in state. (if there are no choices already)
    if (this.state.answerChoices.length === 0) {
      this.setState({ answerChoices: "" });
      const answerChoiz1 = {
        Id: -2000,
        Value: "a",
        AnswerChoice: "",
        SurveyQuestionId: this.state.id,
        LetterIsValid: "",
        TextIsValid: ""
      };
      const answerChoiz2 = {
        Id: -2001,
        Value: "b",
        AnswerChoice: "",
        SurveyQuestionId: this.state.id,
        LetterIsValid: "",
        TextIsValid: ""
      };
      const answerChoizes = [...this.state.answerChoices, answerChoiz1, answerChoiz2];
      this.setState({ answerChoices: answerChoizes });
    }
  };

  onChange = e => {
    if (e.target.name === "questionTypeId" && e.target.value === "2") {
      this.firstTwoChoices();
    }
    this.validateInput(e);

    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    this.setState({ [e.target.name]: value });
  };

  onSubmitNewQuestionValidate = () => {
    let dangerInArray = false;
    const arry = this.state.answerChoices;

    for (let i = 0; i < this.state.answerChoices.length; i++) {
      if (arry[i].LetterIsValid === "has-danger" || arry[i].TextIsValid === "has-danger") {
        dangerInArray = true;
        break;
      }
    }

    if (
      this.state.validate.questionState === "has-success" &&
      this.state.validate.helpTextState === "has-success" &&
      this.state.validate.userIdState === "has-success" &&
      this.state.validate.statusIdState === "has-success" &&
      this.state.validate.sortOrderState === "has-success" &&
      this.state.validate.questionTypeIdState === "has-success" &&
      dangerInArray === false
    ) {
      this.onSubmitNewQuestion();
    } else {
      window.scrollTo(0, 0);
      NotificationManager.warning("Warning!", "At least one input not valid.  Please correct.");
    }
  };

  onSubmitUpdatedQuestionValidate = () => {
    let dangerInArray = false;
    const arry = this.state.answerChoices;

    for (let i = 0; i < this.state.answerChoices.length; i++) {
      if (arry[i].LetterIsValid === "has-danger" || arry[i].TextIsValid === "has-danger") {
        dangerInArray = true;
        break;
      }
    }

    if (
      this.state.validate.questionState !== "has-danger" &&
      this.state.validate.helpTextState !== "has-danger" &&
      this.state.validate.userIdState !== "has-danger" &&
      this.state.validate.statusIdState !== "has-danger" &&
      this.state.validate.sortOrderState !== "has-danger" &&
      this.state.validate.questionTypeIdState !== "has-danger" &&
      dangerInArray === false
    ) {
      this.onSubmitUpdatedQuestion();
    } else {
      window.scrollTo(0, 0);
      NotificationManager.warning("Warning!", "At least one input not valid.  Please correct.");
    }
  };

  onSubmitNewQuestion = () => {
    const {
      question,
      helpText,
      userId,
      statusId,
      questionTypeId,
      sortOrder,
      answerChoices
    } = this.state;

    let isRequired = 0;
    if (this.state.isRequired) {
      isRequired = 1;
    } else {
      isRequired = 0;
    }
    let isMultipleAllowed = 0;
    if (this.state.isMultipleAllowed) {
      isMultipleAllowed = 1;
    } else {
      isMultipleAllowed = 0;
    }
    const req = {
      question,
      helpText,
      isRequired,
      userId,
      statusId,
      isMultipleAllowed,
      questionTypeId,

      sortOrder,
      answerChoices
    };

    surveyQuestionPost(req)
      .then(response => {
        NotificationManager.success("Success!", "New Question Saved");

        this.props.history.push("/admin/surveyQuestionList");
      })
      .catch(err => {
        alert(err);
      });
  };

  onSubmitUpdatedQuestion = () => {
    const {
      id,
      question,
      helpText,
      userId,
      statusId,
      questionTypeId,
      sortOrder,
      answerChoices
    } = this.state;

    let isRequired = 0;
    if (this.state.isRequired) {
      isRequired = 1;
    } else {
      isRequired = 0;
    }
    let isMultipleAllowed = 0;
    if (this.state.isMultipleAllowed) {
      isMultipleAllowed = 1;
    } else {
      isMultipleAllowed = 0;
    }

    const req = {
      id,
      question,
      helpText,
      isRequired,
      userId,
      statusId,
      isMultipleAllowed,
      questionTypeId,
      sortOrder,
      answerChoices
    };

    surveyQuestionPut(req)
      .then(response => {
        this.props.history.push("/admin/surveyQuestionList");
        NotificationManager.success("Success!", "Question Updated");
      })
      .catch(err => {
        alert(err);
      });
  };

  onCancel = () => {
    this.props.history.push("/admin/surveyQuestionList");
  };

  onDelete = () => {
    surveyQuestionDelete(this.state.id)
      .then(response => {
        this.props.history.push("/admin/surveyQuestionList");
        NotificationManager.success("Success!", "Question Deleted");
      })
      .catch(err => {
        alert("Question delete failed");
      });
  };

  onChoiceTextChange = (id, Text) => {
    const answerChoices = this.state.answerChoices.map(quez => {
      const regexString = /^[a-zA-Z0-9.,'!@#$%&?()\s]{1,250}$/;
      if (quez.Id === id) {
        if (regexString.test(Text)) {
          return {
            ...quez,
            AnswerChoice: Text,
            TextIsValid: "has-success"
          };
        } else {
          return { ...quez, AnswerChoice: Text, TextIsValid: "has-danger" };
        }
      } else {
        return quez;
      }
    });
    this.setState({ answerChoices });
  };

  onChoiceValueChange = (id, Value) => {
    const answerChoices = this.state.answerChoices.map(quez => {
      const regexString = /^[a-zA-Z]{1}$/;
      if (quez.Id === id) {
        if (regexString.test(Value)) {
          return {
            ...quez,
            Value: Value,
            LetterIsValid: "has-success"
          };
        } else {
          return { ...quez, Value: Value, LetterIsValid: "has-danger" };
        }
      } else {
        // this is not the one we're looking for
        return quez;
      }
    });
    this.setState({ answerChoices });
  };

  nextId = -1;
  onAddAnswerChoice = () => {
    let spot;
    let lastLetter;
    let value;

    if (this.state.answerChoices.length > 0) {
      spot = this.state.answerChoices.length - 1;
      lastLetter = this.state.answerChoices[spot].Value;
      if (lastLetter === 9 || lastLetter === "z" || lastLetter === "Z") {
        value = lastLetter;
      } else {
        value = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
      }
    } else {
      value = "a";
    }

    const answerChoiz = {
      Id: this.nextId,
      Value: value,
      AnswerChoice: "",
      SurveyQuestionId: this.state.id,
      LetterIsValid: "",
      TextIsValid: ""
    };
    this.nextId--;
    const answerChoizes = [...this.state.answerChoices, answerChoiz];

    this.setState({ answerChoices: answerChoizes });
  };

  onChoiceDelete = stuff => {
    let filterArray = [...this.state.answerChoices];
    const result = filterArray.filter(bit => bit.Id !== stuff);
    this.setState({ answerChoices: result });
  };

  render() {
    if (!this.state.id && !this.state.createPage) {
      return <div>Loading data... : {this.state.createPage} </div>;
    }

    const answerChoices = this.state.answerChoices;
    //const { answerChoices } = this.state.answerChoices;

    return (
      <>
        <h4>{this.state.headerLabel} Survey Question </h4>

        <Card className="px-2 py-2">
          <div key={this.state.id}>
            <FormGroup row>
              <Label htmlFor="question" sm={2}>
                Question
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  name="question"
                  id="question"
                  value={this.state.question}
                  valid={this.state.validate.questionState === "has-success"}
                  invalid={this.state.validate.questionState === "has-danger"}
                  onChange={this.onChange}
                />
                <FormFeedback valid>Question format is valid.</FormFeedback>
                <FormFeedback>
                  Question must be between 3 and 400 characters with no invalid characters.
                </FormFeedback>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label htmlFor="helpText" sm={2}>
                {" "}
                Help Text
              </Label>
              <Col sm={10}>
                <Input
                  type="textarea"
                  name="helpText"
                  id="helpText"
                  value={this.state.helpText}
                  valid={this.state.validate.helpTextState === "has-success"}
                  invalid={this.state.validate.helpTextState === "has-danger"}
                  onChange={this.onChange}
                />
                <FormFeedback valid>Help Text format is valid.</FormFeedback>
                <FormFeedback>
                  {" "}
                  Help Text must be between 3 and 400 characters with no invalid characters.
                </FormFeedback>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="questionTypeId" sm={2}>
                Question Type
              </Label>
              <Col sm={4}>
                <Input
                  type="select"
                  name="questionTypeId"
                  id="questionTypeId"
                  value={this.state.questionTypeId}
                  valid={this.state.validate.questionTypeIdState === "has-success"}
                  invalid={this.state.validate.questionTypeIdState === "has-danger"}
                  onChange={this.onChange}
                >
                  <option />
                  <option value="1">Yes/No/Don't know</option>
                  <option value="2">Multiple Choice</option>
                  <option value="3">Short Text</option>
                  <option value="4">Long Text</option>
                  <option value="5">Upload</option>
                </Input>
                <FormFeedback valid>Question Type input is valid.</FormFeedback>
                <FormFeedback>May not be blank.</FormFeedback>
              </Col>
            </FormGroup>

            {this.state.questionTypeId === "2" && (
              <>
                <Row style={{ marginBottom: 20 }}>
                  <Col>
                    {" "}
                    <Label check>{""} </Label>
                  </Col>
                  <Col sm={10}>
                    <FormGroup check inline>
                      <Input
                        value="1"
                        type="checkbox"
                        name="isMultipleAllowed"
                        checked={this.state.isMultipleAllowed}
                        onChange={this.onChange}
                      />
                      Multiple Answers Allowed
                    </FormGroup>{" "}
                  </Col>
                </Row>

                <FormGroup row>
                  <Label htmlFor="AnswerChoices" sm={2}>
                    Answer Choices
                  </Label>
                  <Col sm={8}>
                    <Table className="table table-sm">
                      <thead>
                        <tr style={{ fontSize: "80%", fontWeight: 100 + "% !important" }}>
                          <th width="40%" style={{ border: "none" }}>
                            {/* Letter */}
                          </th>
                          <th width="60%" style={{ border: "none" }}>
                            {/* Text */}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <AnswerChoice
                          answerChoices={answerChoices}
                          onChoiceValueChange={this.onChoiceValueChange}
                          onChoiceTextChange={this.onChoiceTextChange}
                          onChoiceDelete={this.onChoiceDelete}
                        />
                      </tbody>
                    </Table>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label htmlFor="userId" sm={2} />
                  <Col sm={2}>
                    <Button
                      className="btn btn-secondary"
                      size="sm"
                      onClick={this.onAddAnswerChoice}
                    >
                      Add Answer Choice
                    </Button>
                  </Col>
                </FormGroup>
              </>
            )}

            <FormGroup row>
              <Label htmlFor="userId" sm={2}>
                {" "}
                UserId
              </Label>{" "}
              <Col sm={4}>
                <Input
                  type="text"
                  name="userId"
                  id="userId"
                  value={this.state.userId}
                  valid={this.state.validate.userIdState === "has-success"}
                  invalid={this.state.validate.userIdState === "has-danger"}
                  onChange={this.onChange}
                />
                <FormFeedback valid>User ID format is valid.</FormFeedback>
                <FormFeedback>User ID must have valid email format</FormFeedback>{" "}
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="statusId" sm={2}>
                Status ID
              </Label>

              <Col sm={4}>
                <Input
                  type="select"
                  name="statusId"
                  id="statusId"
                  value={this.state.statusId}
                  valid={this.state.validate.statusIdState === "has-success"}
                  invalid={this.state.validate.statusIdState === "has-danger"}
                  onChange={this.onChange}
                >
                  <option />
                  <option value="4">Active</option>
                  <option value="5">In Draft</option>
                  <option value="7">Retired</option>
                </Input>

                <FormFeedback valid>Status ID input is valid. </FormFeedback>
                <FormFeedback>May not be blank </FormFeedback>
              </Col>
            </FormGroup>

            <FormGroup row>
              <Label for="sortOrder" sm={2}>
                Sort Order
              </Label>
              <Col sm={4}>
                <Input
                  type="number"
                  name="sortOrder"
                  id="sortOrder"
                  value={this.state.sortOrder}
                  valid={this.state.validate.sortOrderState === "has-success"}
                  invalid={this.state.validate.sortOrderState === "has-danger"}
                  onChange={this.onChange}
                />
                <FormFeedback valid>Sort Order input is valid. </FormFeedback>
                <FormFeedback>Integer between 1 and 999 required</FormFeedback>
              </Col>
            </FormGroup>

            <Row>
              <Col sm={2}>
                <Label check> Is Required </Label>
              </Col>
              <Col>
                <FormGroup check inline>
                  <Input
                    name="isRequired"
                    value="1"
                    type="checkbox"
                    checked={this.state.isRequired}
                    onChange={this.onChange}
                  />
                </FormGroup>
              </Col>
            </Row>

            <>
              {this.state.createPage ? (
                <FormGroup>
                  <Button
                    className=" box-shadow-2 btn-md btn btn-primary float-right mt-2 "
                    onClick={this.onCancel}
                  >
                    <i className="fa fa-times-circle mr-2" />
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    className="btn box-shadow-2 btn btn-md btn-success float-right mr-2 mt-2"
                    onClick={this.onSubmitNewQuestionValidate}
                  >
                    <i className="fa fa-thumbs-up mr-2" />
                    Submit New Question
                  </Button>
                </FormGroup>
              ) : (
                <FormGroup row style={{ marginTop: 20 }}>
                  <Col>
                    <Confirmation
                      buttonLabel="Delete Question"
                      header="Are you sure you want to delete this question?"
                      execute={this.onDelete}
                    >
                      Press Confirm to delete "{this.state.question}"
                      {/* <i className="fa fa-trash-o mr-2" /> */}
                    </Confirmation>
                  </Col>
                  <Col>
                    <Button
                      className=" box-shadow-2 btn-md btn btn-primary float-right    "
                      onClick={this.onCancel}
                    >
                      <i className="fa fa-times-circle mr-2" />
                      Cancel
                    </Button>

                    <Button
                      type="button"
                      className="box-shadow-2 btn-md btn btn-success float-right mr-2  "
                      onClick={this.onSubmitUpdatedQuestionValidate}
                    >
                      <i className="fa fa-thumbs-up mr-2" />
                      Submit Updated Question
                    </Button>
                  </Col>
                </FormGroup>
              )}
            </>

            <FormGroup />
          </div>
        </Card>
        <NotificationContainer />
      </>
    );
  }
}
export default withRouter(SurveyQuestionEditInsert);
