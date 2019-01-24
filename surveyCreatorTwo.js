import React from "react";
import { Table, Button, Row, Col } from "reactstrap";
import SurveyQuestionListInsert from "./surveyQuestionListInsert";
import { surveyPost } from "../../services/survey.service";
import LoadScreen from "../../shared/LoadScreen";
import { NotificationManager } from "react-notifications";

class SurveyCreatorTwo extends React.Component {
  state = {
    surveyQuestions: []
  };

  handleSurveyQuestionsUpdate = surveyQuestions => {
    this.setState({ surveyQuestions });
  };

  onSubmitNewSurvey = () => {
    let { name, description, statusId, ownerId, typeId, version, tenantId, appUserId } = this.props;

    const example = this.state.surveyQuestions;
    const arrQuestions = [];
    Object.keys(example).forEach(function(key) {
      let val = example[key]["id"];
      arrQuestions.push(val);
    });

    let result = [];
    function mapper(key, values) {
      for (let i = 0; i < values.length; i++) {
        if (result[i] === undefined) {
          result[i] = {};
        }
        result[i][key] = values[i];
      }
    }

    mapper("SurveyQuestionId", arrQuestions);

    const payload = {
      Name: name,
      Description: description,
      StatusId: statusId,
      OwnerId: ownerId,
      TypeId: typeId,
      Version: version,
      TenantId: tenantId,
      AppUserId: appUserId,
      SurveyQuestions: result
    };

    surveyPost(payload)
      .then(response => {
        NotificationManager.success("Success!", "New Question Saved");
        //alert("Success New Survey Saved");
        //this.props.history.push("./surveysHome");
        this.props.onClickCancel();
      })
      .catch(err => {
        alert(err);
      });
  };

  render() {
    return (
      <>
        {this.state.loading ? (
          <LoadScreen />
        ) : (
          <>
            <div
              className="card col-12"
              style={{ height: "105px", padding: "10px", marginTop: "5px" }}
            >
              <Row>
                <Col className="col-5">
                  <Table borderless size="sm" style={{ fontSize: "1.1em" }}>
                    <tbody>
                      <tr>
                        <td>Survey Name: </td>
                        <td>{this.props.name} </td>
                      </tr>
                      <tr>
                        <td>Description </td>
                        <td>{this.props.description}</td>
                      </tr>
                      <tr>
                        <td> Status </td>
                        <td>{this.props.statusId} </td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col className="col-4">
                  <Table borderless size="sm" style={{ fontSize: "1.1em" }}>
                    <tbody>
                      {/* <tr>
                    <td> Owner ID </td>
                    <td>{this.props.ownerId}</td>
                  </tr> */}
                      <tr>
                        <td> Type of Survey </td>
                        <td>{this.props.typeId} </td>
                      </tr>
                      <tr>
                        <td> Version </td>
                        <td>{this.props.version}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>

                <Col className="col-3">
                  <Button
                    className=" box-shadow-2 btn-md btn btn-primary float-right  "
                    style={{ width: "105px" }}
                    name="back"
                    onClick={e => this.props.onClickBack()}
                  >
                    <i className="fa fa-times-circle mr-2" />
                    Back
                  </Button>

                  <Button
                    className="box-shadow-2 btn-md btn btn-success float-right"
                    syle={{ width: "105px", marginTop: "-10px" }}
                    name="next"
                    onClick={this.onSubmitNewSurvey}
                  >
                    <i className="fa fa-thumbs-up mr-2" />
                    SUBMIT NEW SURVEY
                  </Button>
                </Col>
              </Row>
            </div>

            <SurveyQuestionListInsert
              handleSurveyQuestionsUpdate={this.handleSurveyQuestionsUpdate}
            />
          </>
        )}
      </>
    );
  }
}
export default SurveyCreatorTwo;
