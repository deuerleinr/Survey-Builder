import React from "react";
import {
  Modal,
  Card,
  Row,
  Col,
  Input,
  InputGroupAddon,
  Button,
  InputGroup,
  Container
} from "reactstrap";
import { getQuestions, searchQuestions } from "../../services/surveyQuestion.service";
import QuestionOnlyInsert from "./surveyQuestionOnlyInsert";
import { getQuestionById } from "../../services/surveyQuestion.service";
import { withRouter } from "react-router-dom";
import "./surveyQuestionListInsert.css";
// import SurveyQuestionEditInsert from "./surveyQuestionEditInsert";
import SurveyTest from "./surveyTest";

class SurveyQuestionListInsert extends React.Component {
  state = {
    pagedItemResponse: null,
    pageIndex: 0,
    searchString: null,
    totalCount: 0,
    pageSize: 10000,
    totalPages: 0,
    selectedQuestions: [],
    modal: false,
    backdrop: false,
    questionId: "",
    search: false
  };

  componentDidMount = () => {
    this.loadPage();

    window.scrollTo(0, 0);
  };

  loadPage = () => {
    this.setState({ pagedItemResponse: null });
    const { pageIndex, searchString, pageSize } = this.state;
    const req = { pageIndex, pageSize, searchString };

    getQuestions(req).then(response => {
      this.setState({
        pagedItemResponse: response.data.item.pagedItems,
        totalPages: Math.ceil(response.data.item.totalCount / this.state.pageSize)
      });
    });
  };

  onCreateNewQuestion = () => {
    this.setState({ questionId: "" }, () => {
      this.onToggleEdit();
    });
  };

  onSearchChange = e => {
    const { value } = e.target;
    this.setState({ searchString: value, search: true }, () => {
      const { pageIndex, searchString, pageSize } = this.state;
      const req = { pageIndex, pageSize, searchString };
      searchQuestions(req).then(response => {
        this.setState({
          pagedItemResponse: response.data.item.pagedItems,
          totalPages: Math.ceil(response.data.item.totalCount / this.state.pageSize)
        });
      });
    });
  };

  searchPaginatorPageChange = () => {
    const { pageIndex, searchString, pageSize } = this.state;
    // const pageSize = 10;
    const req = { pageIndex, pageSize, searchString };
    searchQuestions(req).then(response => {
      this.setState({
        pagedItemResponse: response.data.item.pagedItems,
        totalPages: Math.ceil(response.data.item.totalCount / this.state.pageSize)
      });
    });
  };

  goToPage = pageIndex => {
    this.setState({ pageIndex }, () => {
      if (!this.state.searchString) {
        this.loadPage();
      } else {
        this.searchPaginatorPageChange();
      }
    });
  };

  onQuezClick = questionId => {
    const qList = [...this.state.pagedItemResponse];
    let selectedQuestion = qList.filter(q => {
      return q.id === questionId;
    });
    const trimmedArray = qList.filter(bit => bit.id !== questionId);

    getQuestionById(questionId).then(response => {
      if (response.data.item.answerChoices) {
        let jsonAnswerChoices = JSON.parse(response.data.item.answerChoices);
        selectedQuestion[0].answerChoices = jsonAnswerChoices;
        selectedQuestion[0].sortOrder = this.state.selectedQuestions.length;
      }

      const chosenQuestions = [...this.state.selectedQuestions, selectedQuestion[0]];
      this.setState({ selectedQuestions: chosenQuestions, pagedItemResponse: trimmedArray }, () => {
        this.props.handleSurveyQuestionsUpdate(chosenQuestions);
      });
    });
  };

  onQuestionEditComplete = req => {
    const selectedList = [...this.state.selectedQuestions];
    const trimmedArray = selectedList.filter(bit => bit.id !== req.id);
    const trimmedAndAddedArray = [...trimmedArray, req];
    for (let i = 0; i < trimmedAndAddedArray.length; i++) {
      trimmedAndAddedArray[i].sortOrder = i;
    }
    this.setState({ selectedQuestions: trimmedAndAddedArray }, () => {
      this.props.handleSurveyQuestionsUpdate(trimmedAndAddedArray);
    });
  };

  onQuestionCreateComplete = req => {
    const selectedList = [...this.state.selectedQuestions];
    const addedArray = [...selectedList, req];
    for (let i = 0; i < addedArray.length; i++) {
      addedArray[i].sortOrder = i;
    }

    this.setState({ selectedQuestions: addedArray }, () => {
      this.props.handleSurveyQuestionsUpdate(addedArray);
    });
  };

  onRemoveSelectedQuestion = id => {
    const selectedList = [...this.state.selectedQuestions];
    let addArray = selectedList.filter(q => {
      return q.id === id;
    });
    const arrayWithReturnedQuestion = [...this.state.pagedItemResponse, addArray[0]];
    const trimmedArray = selectedList.filter(bit => bit.id !== id);
    for (let i = 0; i < trimmedArray.length; i++) {
      trimmedArray[i].sortOrder = i;
    }

    this.setState(
      {
        selectedQuestions: trimmedArray,
        pagedItemResponse: arrayWithReturnedQuestion
      },
      () => {
        this.props.handleSurveyQuestionsUpdate(trimmedArray);
      }
    );
  };

  onEditSelectedQuestion = id => {
    this.setState({ questionId: id }, () => {
      this.onToggleEdit();
    });
  };

  onToggleEdit = () => {
    const modal = this.state.modal;
    this.setState({ modal: !modal });
  };

  onShiftQuestionUp = id => {
    function compare(a, b) {
      if (a.sortOrder < b.sortOrder) return -1;
      if (a.sortOrder > b.sortOrder) return 1;
      return 0;
    }
    if (id > 0) {
      let sortArray = [...this.state.selectedQuestions];
      sortArray[id].sortOrder--;
      sortArray[id - 1].sortOrder++;
      sortArray.sort(compare);
      this.setState({ selectedQuestions: sortArray });
    }
  };

  onShiftQuestionDown = id => {
    let sortArray = [...this.state.selectedQuestions];
    if (id + 1 < sortArray.length) {
      sortArray[id].sortOrder++;
      sortArray[id + 1].sortOrder--;
      sortArray.sort((a, b) =>
        a.sortOrder > b.sortOrder ? 1 : b.sortOrder > a.sortOrder ? -1 : 0
      );
      this.setState({ selectedQuestions: sortArray });
    }
  };

  render() {
    if (!this.state.pagedItemResponse && !this.state.search) {
      return <div>Loading data... </div>;
    }

    const questions = this.state.pagedItemResponse;
    const selectees = this.state.selectedQuestions;
    return (
      <React.Fragment>
        <div className="card col-12 leftRightLists">
          <Row>
            <Col className="col-6 leftDiv">
              <div>
                <h4>
                  Question Bank
                  {this.state.pagedItemResponse ? (
                    <span className="float-right" style={{ fontSize: ".7em" }}>
                      {this.state.pagedItemResponse.length} Question
                      {this.state.pagedItemResponse.length !== 1 && "s"}
                    </span>
                  ) : (
                    <span className="float-right" style={{ fontSize: ".7em" }}>
                      No Matches
                    </span>
                  )}
                </h4>
              </div>

              <div>
                <React.Fragment>
                  <Row>
                    {" "}
                    {/* searchPaginatorPageChange */}
                    <Col>
                      {/* <Col xs="8"> */}
                      <InputGroup>
                        <Input
                          placeholder="Search Questions.."
                          // className="col-md-3"
                          onChange={this.onSearchChange}
                        />

                        <InputGroupAddon addonType="append">
                          <Button onClick={this.loadPage}>
                            <i className="fa fa-search" />
                          </Button>
                        </InputGroupAddon>
                      </InputGroup>
                    </Col>
                  </Row>
                </React.Fragment>

                <div>
                  {questions ? (
                    <>
                      {/* <Paginator
                        currentPage={this.state.pageIndex}
                        totalPages={this.state.totalPages}
                        goTo={this.goToPage}
                        style={{ marginTop: "16px" }}
                        className="m-2"
                      /> */}

                      <div>
                        {questions.map(questions => (
                          <QuestionOnlyInsert
                            onQuezClick={this.onQuezClick}
                            questions={questions}
                            key={questions.id}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <div>{null}</div>
                  )}
                </div>
              </div>
            </Col>

            {/* <Col className="col-6 rightDiv" style={{ backgroundColor: "lightGray" }}> */}
            <Col className="col-6 rightDiv">
              <div style={{ counterReset: "section" }}>
                <h4>
                  Selected Questions
                  <span className="float-right" style={{ fontSize: ".7em" }}>
                    {this.state.selectedQuestions.length} Question
                    {this.state.selectedQuestions.length !== 1 && "s"}
                  </span>
                </h4>

                <Button
                  className="btn btn-sm btn-success drop-shadow-2"
                  onClick={this.onCreateNewQuestion}
                >
                  <i className="fa fa-thumbs-up mr-2" />
                  Create New Question
                </Button>

                {selectees.map(bit => (
                  <Card key={bit.id} style={{ counterIncrement: "section" }}>
                    <Row>
                      <Col className="Selected col-9">
                        <h4>
                          {".   "}
                          {bit.question}
                        </h4>
                      </Col>
                      <Col>
                        <Row>
                          <Col>
                            <div className="float-right">
                              {bit.sortOrder > 0 && (
                                <a
                                  href="#"
                                  onClick={e => {
                                    e.preventDefault();
                                    this.onShiftQuestionUp(bit.sortOrder);
                                  }}
                                >
                                  <i
                                    className="ft ft-arrow-up warning"
                                    style={{ fontSize: "1.5em" }}
                                  />
                                </a>
                              )}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <div className="float-right">
                              {bit.sortOrder + 1 < this.state.selectedQuestions.length && (
                                <a
                                  href="#"
                                  onClick={e => {
                                    e.preventDefault();
                                    this.onShiftQuestionDown(bit.sortOrder);
                                  }}
                                >
                                  <i
                                    className="ft ft-arrow-down warning"
                                    style={{ fontSize: "1.5em" }}
                                  />
                                </a>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col style={{ offset: 1 }}>
                        {bit.answerChoices.map(thing => (
                          <Row key={thing.Id}>
                            <Col className="col-1 ml-2">
                              <i className="ft ft-square" />
                            </Col>
                            <Col className="col-10">{thing.AnswerChoice}</Col>
                          </Row>
                        ))}
                      </Col>
                    </Row>
                    <Row>
                      <Col className="col-12 mt-2">
                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            this.onRemoveSelectedQuestion(bit.id);
                          }}
                        >
                          <i
                            className=" ft ft-delete  primary float-right "
                            style={{ fontSize: "2.2em", justifyContent: "right" }}
                          />
                        </a>

                        <a
                          href="#"
                          onClick={e => {
                            e.preventDefault();
                            this.onEditSelectedQuestion(bit.id);
                          }}
                        >
                          <i
                            className="ft ft-edit mr-2 warning "
                            style={{ fontSize: "2em", justifyContent: "right" }}
                          />
                        </a>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            </Col>
          </Row>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.ontoggleEdit}
          backdrop={this.state.backdrop}
          size="lg"
        >
          <Container style={{ padding: "20px" }}>
            <SurveyTest
              questionId={this.state.questionId}
              onToggleEdit={this.onToggleEdit}
              onQuestionEditComplete={this.onQuestionEditComplete}
              onQuestionCreateComplete={this.onQuestionCreateComplete}
              onNewSurveySubmit={this.onNewSurveySubmit}
            />
          </Container>
        </Modal>
      </React.Fragment>
    );
  }
}

export default withRouter(SurveyQuestionListInsert);
