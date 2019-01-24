import React from "react";
import { Input, Button } from "reactstrap";
class SurveyCreatorOne extends React.Component {
  state = {
    name_isvalid: true,
    description_isvalid: true,
    statusid_isvalid: true,
    ownerid_isvalid: true,
    typeid_isvalid: true,
    version_isvalid: true
    // showSurveys: true,
    // useForm: false,
    // editForm: false,
    // exitCreate: false,
    // exitEdit: false,
    // loading: false,
    // modal: false,
    // backdrop: false
  };

  onCancel = () => {
    this.props.history.push("/admin");
  };

  render() {
    return (
      <>
        <div className="containerPadding ">
          {/* <form style={{ marginTop: 30 }}> */}

          <form className="novalidate card cardPadding" style={{ marginTop: 30 }}>
            {/* <form className="novalidate card cardPadding" style={{ marginTop: 30 }}> */}

            <h3 className="text-center">Create Survey</h3>
            <div className="form-group    ">
              Name: <span className="required">*</span>
              <div className="controls">
                <input
                  type="text"
                  placeholder="Please enter name"
                  style={{ textTransform: "capitalize" }}
                  value={this.props.name}
                  onChange={e => this.props.onChange(e.target)}
                  name="name"
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
                  type="text"
                  value={this.props.description}
                  placeholder="Please enter description"
                  onChange={e => this.props.onChange(e.target)}
                  name="description"
                  className="form-control"
                />
                {!this.state.description_isvalid && (
                  <span style={{ color: "red" }}>Please enter a better description</span>
                )}
              </div>
            </div>
            <br />

            {/* <div className="form-group">
              <h6>
                Owner Id: <span className="required">*</span>
              </h6>
              <div className="controls">
                <input
                  value={this.props.ownerId}
                  type="number"
                  placeholder="Please enter your owner ID"
                  name="ownerId"
                  onChange={e => this.props.onChange(e.target)}
                  className="form-control"
                />
                {!this.state.ownerid_isvalid && (
                  <span style={{ color: "red" }}>
                    Owner ID must be an integer of either 1, 2, or 3
                  </span>
                )}
              </div>
            </div>
            <br /> */}

            <div className="form-group">
              <h6>
                Status Id: <span className="required">*</span>
              </h6>

              <Input
                type="select"
                value={this.props.statusId}
                name="statusId"
                onChange={e => this.props.onChange(e.target)}
                placeholder="Select one"
              >
                <option value="" />
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
              <Input
                type="select"
                value={this.props.typeId}
                name="typeId"
                onChange={e => this.props.onChange(e.target)}
              >
                <option value="" />
                <option value="1">Consumer Research</option>
                <option value="2">Suggestions</option>
                <option value="3">Customer Satisfaction</option>
              </Input>
            </div>
            <br />
            <div className="form-group">
              <h6>
                Version: <span className="required">*</span>
              </h6>
              <Input
                type="select"
                value={this.props.version}
                name="version"
                onChange={e => this.props.onChange(e.target)}
              >
                <option value="" />
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </Input>
            </div>
            <br />
            <Button
              className="box-shadow-2 btn-md btn btn-success"
              type="button"
              name="showPageTwo"
              onClick={e => this.props.onClickNextStep()}
            >
              <i className="fa fa-pencil mr-2" />
              Next Step: Add Questions
            </Button>
            <Button
              className=" box-shadow-2 btn-md btn btn-primary    "
              onClick={this.props.onClickCancel}
            >
              <i className="fa fa-times-circle mr-2" />
              Cancel
            </Button>
          </form>
        </div>
      </>
    );
  }
}
export default SurveyCreatorOne;
