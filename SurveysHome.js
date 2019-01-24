import React from "react";
import axios from "axios";
import { Modal, Input, Row, Col, Button, Container, Card } from "reactstrap";
import { NotificationManager } from "react-notifications";

class SurveysHome extends React.Component {
  state = {
    surveys: [],
    name: "",
    description: "",
    typeId: "",
    statusId: "",
    ownerId: "",
    version: "",
    surveyId: "",
    name_isvalid: true,
    description_isvalid: true,
    statusid_isvalid: true,
    ownerid_isvalid: true,
    typeid_isvalid: true,
    version_isvalid: true,
    showSurveys: true,
    useForm: false,
    editForm: false,
    exitCreate: false,
    exitEdit: false,
    loading: false,
    modal: false,
    backdrop: false,
    publishList: "",
    progressBarWidth: 1
  };

  surveyType = int => {
    if (int === 1) {
      return "Customer Satisfaction";
    } else if (int === 2) {
      return "Suggestions";
    }
  };

  handleNameChange = e => {
    const name = e.target.value;
    let name_isvalid = true;
    if (name.length < 2) {
      name_isvalid = false;
    } else if (name.length > 50) {
      name_isvalid = false;
    }
    this.setState({ name, name_isvalid });
  };

  handleDescriptionChange = e => {
    const description = e.target.value;
    let description_isvalid = true;
    if (description.length < 2) {
      description_isvalid = false;
    } else if (description.length > 50) {
      description_isvalid = false;
    }
    this.setState({ description, description_isvalid });
  };
  handleOwnerIdChange = e => {
    const ownerId = e.target.value;
    let ownerid_isvalid = false;
    if (ownerId.length === 1) {
      ownerid_isvalid = true;
    }
    this.setState({ ownerId, ownerid_isvalid });
  };
  handleStatusIdChange = e => {
    const statusid = e.target.value;
    this.setState({ statusid });
  };

  handleTypeIdChange = e => {
    const typeid = e.target.value;
    this.setState({ typeid });
  };
  handleVersionOnChange = e => {
    const version = e.target.value;
    this.setState({ version });
  };

  getSurveys = () => {
    axios.get("/api/survey").then(response => {
      let surveys = response.data.items.reverse();
      for (let i = 0; i < surveys.length; i++) {
        this.setState({ surveys });
      }
    });
  };

  componentDidMount() {
    this.getSurveys();
  }
  handleEditSurveyClick = survey => {
    this.setEditValues(survey);
    this.toggleEdit();
  };

  handlePublishSurveyClick = survey => {
    this.setEditValues(survey);
    this.togglePublish();
  };
  setEditValues = data => {
    const surveyId = data.id;
    const name = data.name;
    const description = data.description;
    const typeId = data.typeId;
    const statusId = data.statusId;
    const ownerId = data.ownerId;
    const version = data.version;

    this.setState({ version, surveyId, typeId, statusId, ownerId, name, description });
  };

  handleEditSurvey = id => {
    this.setState({ loading: true });
    axios
      .put("/api/survey/" + id, {
        Id: this.state.surveyId,
        name: this.state.name,
        description: this.state.description,
        statusid: this.state.statusId,
        ownerid: this.state.ownerId,
        typeid: this.state.typeId,
        version: this.state.version
      })
      .then(response => {
        this.setState({ loading: false });

        alert("Edit was successful");
        this.toggleEdit();
        window.location.reload();
      })
      .catch(response => alert("Please edit and fill out all fields"));
  };

  handleSubmitSurvey = () => {
    axios
      .post("/api/survey", {
        name: this.state.name,
        description: this.state.description,
        statusid: this.state.statusid,
        ownerid: this.state.ownerId,
        typeid: this.state.typeid,
        version: this.state.typeid
      })
      .then(response => {
        alert("Create was succesful");
        this.toggleCreate();
        window.location.reload();
      })
      .catch(response => alert("Please fill out all fields"));
  };

  handleCreateSurveyClick = e => {
    // this.toggleCreate();
    this.props.history.push("./surveyCreator");

    this.setState({
      name: "",
      description: "",
      typeId: "",
      statusId: "",
      ownerId: "",
      surveyId: "",
      version: ""
    });
  };

  // toggleCreate = () => {
  //   const modalCreate = this.state.modalCreate;
  //   this.setState({
  //     modalCreate: !modalCreate
  //   });
  // };

  toggleEdit = () => {
    const modal = this.state.modal;
    this.setState({
      modal: !modal
    });
  };

  togglePublish = () => {
    const modalPublish = this.state.modalPublish;
    this.setState({ modalPublish: !modalPublish });
  };

  handleDeleteClick = id => {
    if (window.confirm("Are you sure you want to delete this survey?")) {
      this.handleDeleteSurvey(id);
    }
  };
  handleDeleteSurvey = id => {
    axios
      .delete("/api/survey/" + id, {
        Id: this.state.surveyId
      })
      .then(response => {
        alert("Delete was successful");
        window.location.reload();
      })
      .catch(response => {
        alert("Delete was unsuccessful");
      });
  };

  handlePublishListChange = e => {
    const publishList = e.target.value;
    this.setState({ publishList });
  };

  onPublishClick = () => {
    //MAKE THIS WAIT FOR 5 SECONDS
    NotificationManager.success("Success!", "Survey Sent to Email List");
    this.togglePublish();
  };

  render() {
    return (
      <React.Fragment>
        {/* Surveys List start*/}
        <div style={{ height: "100px" }}>
          <h1>Surveys Home</h1>
        </div>
        <div>
          <Button
            type="button"
            style={{ position: "absolute", top: "8px", right: "80px" }}
            className="btn  btn-success box-shadow-2"
            onClick={this.handleCreateSurveyClick}
          >
            {" "}
            <i className="fa fa-edit mr-2" />
            Create New Survey
          </Button>
        </div>
        <div className="row">
          {this.state.surveys.map(survey => (
            <div key={survey.id} className="col-md-4">
              <div className="card">
                <div className="card-body">
                  <div className="card-block">
                    <div className="card-text">
                      {/* <ul className="card-text"> */}
                      {/* <div> */}

                      <b style={{ fontSize: 20 }}> {survey.name}</b>
                      <br />
                      <br />

                      <b>Description: </b>
                      {survey.description}
                      <br />

                      <b>Survey Type: </b>
                      {this.surveyType(survey.typeId)}
                      {/* </div> */}
                      {/* </ul> */}
                    </div>
                    <Row>
                      <Col>
                        {" "}
                        <button
                          type="button"
                          className="btn btn-warning box-shadow-2"
                          onClick={() => this.handleEditSurveyClick(survey)}
                          style={{ marginTop: 20 }}
                        >
                          <i className="fa fa-edit mr-2" /> Edit
                        </button>
                      </Col>
                      <Col>
                        <Button
                          type="button"
                          className="btn btn-success box-shadow-2"
                          onClick={() => this.handlePublishSurveyClick(survey)}
                          style={{ marginTop: 20 }}
                        >
                          <i className="fa fa-paper-plane mr-2" />
                          Publish
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Surveys list end */}
        {/* MODAL FOR SIMULATED PUBLISH START  */}
        <Modal
          isOpen={this.state.modalPublish}
          toggle={this.togglePublish}
          backdrop={this.state.backdrop}
          // modal={this.state.modalPublish}
        >
          <Container>
            <Card className="novalidate card cardPadding">
              <form className="novalidate card cardPadding">
                <Button
                  type="button"
                  className="btn btn-primary box-shadow-2"
                  onClick={this.togglePublish}
                >
                  <i className="fa fa-lg fa-times-circle mr-3" />
                </Button>
                <h3 className="text-center">Publish Survey</h3>
                <Row>
                  <Col>Name</Col>
                  <Col> {this.state.name} </Col>
                </Row>
                <Row>
                  <Col>Description</Col>
                  <Col> {this.state.description} </Col>
                </Row>
                <Row>
                  <Col>Version</Col>
                  <Col> {this.state.version} </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col>Select Email List</Col>
                  <Col>
                    <Input
                      type="select"
                      value={this.state.publishList}
                      onChange={this.handlePublishListChange}
                    >
                      <option value="" />
                      <option value="1">All Users</option>
                      <option value="2">New Users</option>
                      <option value="3">Recent Purchasers</option>
                      <option value="4">Leads</option>
                    </Input>
                  </Col>
                </Row>
                {this.state.publishList && (
                  <>
                    <Button
                      className="btn btn-success box-shadow-2"
                      style={{ marginTop: "20px" }}
                      onClick={this.onPublishClick}
                    >
                      <i className="fa fa-paper-plane mr-2" />
                      Publish
                    </Button>
                  </>
                )}
              </form>
            </Card>
          </Container>
        </Modal>
        {/* MODAL for edit start */}
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggleCreate}
          backdrop={this.state.backdrop}
          // modal={this.state.modal}
        >
          <button type="button" className="btn btn-danger" onClick={this.toggleEdit}>
            X
          </button>
          <div
            className="col-12 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#04b9b6" }}
          >
            <div className="containerPadding content-header">
              <form className="novalidate card cardPadding">
                <h3 className="text-center">Edit Survey</h3>
                <div className="form-group">
                  Name: <span className="required">*</span>
                  <div className="controls">
                    <input
                      value={this.state.name}
                      type="text"
                      placeholder="Please enter name"
                      style={{ textTransform: "capitalize" }}
                      onChange={this.handleNameChange}
                      name="text"
                      className="form-control"
                    />
                    {!this.state.name_isvalid && (
                      <span style={{ color: "red" }}>Name must be between 2 and 50 characters</span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Description: <span className="required">*</span>
                  </h6>
                  <div className="controls">
                    <input
                      value={this.state.description}
                      placeholder="Please enter description"
                      type="text"
                      style={{ textTransform: "capitalize" }}
                      onChange={this.handleDescriptionChange}
                      name="text"
                      className="form-control"
                    />
                    {!this.state.description_isvalid && (
                      <span style={{ color: "red" }}>Please enter a better description</span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Owner Id: <span className="required">*</span>
                  </h6>
                  <div className="controls">
                    <input
                      value={this.state.ownerId}
                      type="number"
                      placeholder="Please enter your owner ID"
                      onChange={this.handleOwnerIdChange}
                      className="form-control"
                    />
                    {!this.state.ownerid_isvalid && (
                      <span style={{ color: "red" }}>
                        Owner ID must be an integer of either 1, 2, or 3
                      </span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Status Id: <span className="required">*</span>
                  </h6>

                  <Input
                    type="select"
                    value={this.state.statusId}
                    onChange={this.handleStatusIdChange}
                  >
                    <option value="4">Draft</option>
                    <option value="5">Active</option>
                    <option value="7">Retired</option>
                  </Input>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Type of Survey: <span className="required">*</span>
                  </h6>
                  <Input type="select" value={this.state.typeId} onChange={this.handleTypeIdChange}>
                    <option value="1">Customer Satisfaction</option>
                    <option value="2">Suggestions</option>
                    <option value="3">Consumer Research</option>
                  </Input>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Version: <span className="required">*</span>
                  </h6>
                  <Input
                    type="select"
                    value={this.state.version}
                    onChange={this.handleVersionOnChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Input>
                </div>
                <br />
                <button
                  className="btn btn-success"
                  style={{ matgin: "10px" }}
                  type="button"
                  onClick={() => this.handleEditSurvey(this.state.surveyId)}
                >
                  Edit Survey
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => this.handleDeleteClick(this.state.surveyId)}
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </Modal>
        {/* Modal for edit end */}
        {/* Modal for Create */}
        {/* <Modal
          modalCreate={this.state.modalCreate}
          isOpen={this.state.modalCreate}
          backdrop={this.state.backdrop}
        >
          <button type="button" className="btn btn-danger" onClick={this.toggleCreate}>
            X
          </button>
          <div
            className="col-12 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#04b9b6" }}
          >
            <div className="containerPadding content-header">
              <form className="novalidate card cardPadding">
                <h3 className="text-center">Create Survey</h3>
                <div className="form-group">
                  Name: <span className="required">*</span>
                  <div className="controls">
                    <input
                      value={this.state.name}
                      type="text"
                      placeholder="Please enter name"
                      style={{ textTransform: "capitalize" }}
                      onChange={this.handleNameChange}
                      name="text"
                      className="form-control"
                    />
                    {!this.state.name_isvalid && (
                      <span style={{ color: "red" }}>Name must be between 2 and 50 characters</span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Description: <span className="required">*</span>
                  </h6>
                  <div className="controls">
                    <input
                      value={this.state.description}
                      placeholder="Please enter description"
                      type="text"
                      style={{ textTransform: "capitalize" }}
                      onChange={this.handleDescriptionChange}
                      name="text"
                      className="form-control"
                    />
                    {!this.state.description_isvalid && (
                      <span style={{ color: "red" }}>Please enter a better description</span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Owner Id: <span className="required">*</span>
                  </h6>
                  <div className="controls">
                    <input
                      value={this.state.ownerId}
                      type="number"
                      placeholder="Please enter your owner ID"
                      onChange={this.handleOwnerIdChange}
                      className="form-control"
                    />
                    {!this.state.ownerid_isvalid && (
                      <span style={{ color: "red" }}>
                        Owner ID must be an integer of either 1, 2, or 3
                      </span>
                    )}
                  </div>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Status Id: <span className="required">*</span>
                  </h6>

                  <Input
                    type="select"
                    value={this.state.statusid}
                    onChange={this.handleStatusIdChange}
                  >
                    <option value="4">Draft</option>
                    <option value="5">Active</option>
                    <option value="7">Retired</option>
                  </Input>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Type of Survey: <span className="required">*</span>
                  </h6>
                  <Input type="select" value={this.state.typeid} onChange={this.handleTypeIdChange}>
                    <option value="1">Customer Satisfaction</option>
                    <option value="2">Suggestions</option>
                  </Input>
                </div>
                <br />
                <div className="form-group">
                  <h6>
                    Version: <span className="required">*</span>
                  </h6>
                  <Input
                    type="select"
                    value={this.state.version}
                    onChange={this.handleVersionOnChange}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </Input>
                </div>
                <br />
                <button
                  className="btn btn-success"
                  style={{ matgin: "10px" }}
                  type="button"
                  onClick={this.handleSubmitSurvey}
                >
                  Create
                </button>
              </form>
            </div>
          </div>
        </Modal> */}
        {/* Modal for create end */}
      </React.Fragment>
    );
  }
}

export default SurveysHome;
