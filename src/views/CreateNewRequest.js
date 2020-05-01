import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  FormInput,
  FormCheckbox,
  FormSelect,
  Button,
  FormTextarea
} from "shards-react";

import PageTitle from "../components/common/PageTitle";
import Editor from "../components/add-new-post/Editor";
import SidebarActions from "../components/add-new-post/SidebarActions";
import SidebarCategories from "../components/add-new-post/SidebarCategories";
import Geosuggest from "react-geosuggest";
import axios from "axios";
import { api_url } from "../utils/constants";
const getAssetCategoryList = async group => {
  let url = `${api_url}/asset/list/category?`;
  if (group || group == 0) {
    url += `group=${group}`;
  }
  let response = await axios
    .get(url, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

const getAssetGroupList = async () => {
  let url = `${api_url}/asset/list/group?`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `role=${role}`;
  }
  let response = await axios
    .get(url, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const broadcastServiceRequest = async data => {
  let response = await axios
    .post(`${api_url}/service/request/new`, data, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
      alert(error.response.data.error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
const getPHCList = async () => {
  let url = `${api_url}/phc/list/?a=b`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `role=${role}`;
  }
  let response = await axios
    .get(url, {
      headers: { "x-access-token": sessionStorage.getItem("access_token") }
    })
    .catch(error => {
      console.log(error);
    });
  try {
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};
class CreateNewRequest extends Component {
  state = {
    asset_categories: [],
    asset_groups: [],
    phcs: [],
    selected_category: null,
    selected_group: 0,
    number_of_units: 1,
    lat_0: null,
    lng_0: null,
    address_0: "",
    lat_1: null,
    lng_1: null,
    address_1: null,
    add_second_address: false,
    search_radius: 25,
    support_contact: sessionStorage.getItem("support_contact"),
    address_0_custom: false,
    address_1_custom: false,
    show_address_0_suggestion: false,
    show_address_1_suggestion: false
  };
  populate_asset_categories = async () => {
    let categories = await getAssetCategoryList(this.state.selected_group);
    console.log(categories);
    this.setState({
      asset_categories: categories,
      selected_category: categories[0] ? categories[0].id : null
    });
  };
  populate_asset_groups = async () => {
    let groups = await getAssetGroupList();
    console.log(groups);
    this.setState(
      { asset_groups: groups, selected_group: groups[0] ? groups[0].id : null },
      this.populate_asset_categories
    );
  };
  populate_phc_list = async () => {
    let phcs = await getPHCList();
    // console.log(phcs);
    let options = [];
    phcs.forEach((item, i) => {
      options.push({ label: item[1], value: item[3].split(",") });
    });
    // console.log(options);
    this.setState({ phcs: options });
  };
  componentDidMount() {
    this.populate_asset_groups();
    this.populate_phc_list();
    // this.populate_asset_categories(this.state.selected_group);
  }

  render() {
    return (
      <Container fluid className="main-content-container px-4 pb-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title="Request For Services"
            subtitle="Request for services such as ambulances, police asistance etc."
            className="text-sm-left"
          />
        </Row>

        <Row>
          {/* Editor */}
          <Col lg="9" md="12">
            <Card>
              <CardBody>
                <Form>
                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Request Group</label>
                      <FormSelect
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select Category"
                        value={this.state.selected_group}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState(
                            { selected_group: e.target.value },
                            this.populate_asset_categories
                          );
                        }}
                      >
                        {this.state.asset_groups.map(group => {
                          return (
                            <option value={group.id}>{group.title}</option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Request Category</label>
                      <FormSelect
                        // id="feEmailAddress"
                        type="text"
                        placeholder="Select Category"
                        value={this.state.selected_category}
                        onChange={e => {
                          console.log(e.target.value);
                          this.setState({ selected_category: e.target.value });
                        }}
                      >
                        {this.state.asset_categories.map(category => {
                          return (
                            <option value={category.id}>
                              {category.title}
                            </option>
                          );
                        })}
                      </FormSelect>
                    </Col>
                    <Col md="6">
                      <label htmlFor="fePassword">No. of units required</label>
                      <FormInput
                        type="number"
                        placeholder="Unit Count"
                        value={this.state.number_of_units}
                        onChange={e => {
                          this.setState({ number_of_units: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>

                  <Row form>
                    <Col md="6" className="form-group">
                      <label htmlFor="fePhoneNumber">Pickup Address</label>
                      {!this.state.address_0_custom && (
                        <Geosuggest
                          // ref={el => (this._geoSuggest = el)}
                          placeholder="Search by address"
                          highlightMatch={true}
                          country="in"
                          style={{
                            input: {
                              padding: "0px 10px",
                              color: "#454545",
                              backgroundColor: "#fff",
                              boxSizing: "border-box",
                              margin: "0px 0px",
                              height: "35px",
                              width: "392px",
                              borderRadius: "5px",
                              border: "1px solid #ddd",
                              fontSize: "12px"
                            },
                            suggests: {
                              color: "#fff",
                              display: this.state.show_address_0_suggestion
                                ? "block"
                                : "none",
                              marginTop: "0px",
                              marginBottom: "0px",
                              position: "absolute",
                              zIndex: 1,
                              backgroundColor: "#fff",
                              borderRadius: "10px",
                              boxShadow: "rgb(238, 238, 238) 0px 0px 8px 8px"
                            },
                            suggestItem: {
                              backgroundColor: "#fff",
                              padding: "10px 10px",
                              cursor: "pointer",
                              color: "#454545"
                            }
                          }}
                          onBlur={() => {
                            this.setState({ show_address_0_suggestion: false });
                          }}
                          onFocus={() => {
                            this.setState({ show_address_0_suggestion: true });
                          }}
                          onSuggestNoResults={() => {
                            this.setState({
                              lat_0: "",
                              lng_0: "",
                              address_0: ""
                            });
                          }}
                          onChange={text => {
                            this.setState({ show_address_0_suggestion: true });
                          }}
                          onSuggestSelect={suggest => {
                            if (suggest && suggest.location) {
                              console.log(suggest);
                              this.setState({
                                show_address_0_suggestion: false,
                                address_0: suggest.label,
                                lat_0: suggest.location.lat,
                                lng_0: suggest.location.lng
                              });
                            }
                          }}
                        />
                      )}
                      {!this.state.address_0_custom &&
                        (sessionStorage.getItem("user_role") === "meds_admin" ||
                          sessionStorage.getItem("user_role") === "super") && (
                          <React.Fragment>
                            <Row style={{ margin: "10px 0px" }}>
                              <Col style={{ padding: "0px", fontSize: "12px" }}>
                                Or select a PHC
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <FormSelect
                                  onChange={e => {
                                    console.log(e.target.value);
                                    this.setState(
                                      {
                                        lat_0: e.target.value.split(",")[0],
                                        lng_0: e.target.value.split(",")[1],
                                        address_0: e.target.value
                                          .split(",")[2]
                                          .replace("||", ",")
                                      },
                                      () => {
                                        console.log(this.state);
                                      }
                                    );
                                  }}
                                >
                                  <option value={[null, null, null]}>
                                    Select a PHC
                                  </option>
                                  {this.state.phcs.map(item => {
                                    return (
                                      <option
                                        value={[
                                          ...item.value,
                                          item.label.replace(",", "||")
                                        ]}
                                      >
                                        {item.label}
                                      </option>
                                    );
                                  })}
                                </FormSelect>
                              </Col>
                            </Row>
                          </React.Fragment>
                        )}
                      {this.state.address_0_custom && (
                        <FormTextarea
                          // id="feEmailAddress"
                          type="text"
                          placeholder="Enter First Address"
                          value={this.state.address_0}
                          onChange={e => {
                            console.log(e.target.value);
                            this.setState({ address_0: e.target.value });
                          }}
                          style={{ minHeight: "100px" }}
                        />
                      )}
                    </Col>
                    <Col md="3">
                      <label htmlFor="fePassword">Latitude</label>
                      <FormInput
                        type="number"
                        placeholder="Latitude"
                        value={this.state.lat_0}
                        disabled={!this.state.address_0_custom}
                        onChange={e => {
                          this.setState({ lat_0: e.target.value });
                        }}
                      />
                    </Col>
                    <Col md="3">
                      <label htmlFor="fePassword">Longitude</label>
                      <FormInput
                        type="number"
                        placeholder="Longitude"
                        value={this.state.lng_0}
                        disabled={!this.state.address_0_custom}
                        onChange={e => {
                          this.setState({ lng_0: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      style={{
                        position: "relative",
                        top: "-10px",
                        left: "5px",
                        fontSize: "12px"
                      }}
                    >
                      <FormCheckbox
                        checked={this.state.address_0_custom}
                        onChange={e => {
                          console.log(e.target.checked);
                          this.setState({
                            address_0_custom: e.target.checked,
                            lat_0: "",
                            lng_0: "",
                            address_0: ""
                          });
                        }}
                      >
                        Use custom address and location
                      </FormCheckbox>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        onClick={() => {
                          this.setState({ add_second_address: true });
                        }}
                      >
                        Add destination address
                      </Button>
                    </Col>
                  </Row>
                  <br />

                  {this.state.add_second_address && (
                    <React.Fragment>
                      <Row form>
                        <Col md="6" className="form-group">
                          <label htmlFor="fePhoneNumber">
                            Destination Address
                          </label>
                          {!this.state.address_1_custom && (
                            <Geosuggest
                              // ref={el => (this._geoSuggest = el)}
                              placeholder="Search by address"
                              highlightMatch={true}
                              country="in"
                              style={{
                                input: {
                                  padding: "0px 10px",
                                  color: "#454545",
                                  backgroundColor: "#fff",
                                  boxSizing: "border-box",
                                  margin: "0px 0px",
                                  height: "35px",
                                  width: "392px",
                                  borderRadius: "5px",
                                  border: "1px solid #ddd",
                                  fontSize: "12px"
                                },
                                suggests: {
                                  color: "#fff",
                                  display: this.state.show_address_1_suggestion
                                    ? "block"
                                    : "none",
                                  marginTop: "0px",
                                  marginBottom: "0px",
                                  position: "absolute",
                                  zIndex: 1,
                                  backgroundColor: "#fff",
                                  borderRadius: "10px",
                                  boxShadow:
                                    "rgb(238, 238, 238) 0px 0px 8px 8px"
                                },
                                suggestItem: {
                                  backgroundColor: "#fff",
                                  padding: "10px 10px",
                                  cursor: "pointer",
                                  color: "#454545"
                                }
                              }}
                              onBlur={() => {
                                this.setState({
                                  show_address_1_suggestion: false
                                });
                              }}
                              onFocus={() => {
                                this.setState({
                                  show_address_1_suggestion: true
                                });
                              }}
                              onSuggestNoResults={() => {
                                this.setState({
                                  lat_1: "",
                                  lng_1: "",
                                  address_1: ""
                                });
                              }}
                              onChange={text => {
                                this.setState({
                                  show_address_1_suggestion: true
                                });
                              }}
                              onSuggestSelect={suggest => {
                                if (suggest && suggest.location) {
                                  console.log(suggest);
                                  this.setState({
                                    show_address_1_suggestion: false,
                                    address_1: suggest.label,
                                    lat_1: suggest.location.lat,
                                    lng_1: suggest.location.lng
                                  });
                                }
                              }}
                            />
                          )}
                          {!this.state.address_1_custom &&
                            (sessionStorage.getItem("user_role") ===
                              "meds_admin" ||
                              sessionStorage.getItem("user_role") ===
                                "super") && (
                              <React.Fragment>
                                <Row style={{ margin: "10px 0px" }}>
                                  <Col
                                    style={{ padding: "0px", fontSize: "12px" }}
                                  >
                                    Or select a PHC
                                  </Col>
                                </Row>
                                <Row>
                                  <Col>
                                    <FormSelect
                                      onChange={e => {
                                        this.setState({
                                          lat_1: e.target.value.split(",")[0],
                                          lng_1: e.target.value.split(",")[1],
                                          address_1: e.target.value
                                            .split(",")[2]
                                            .replace("||", ",")
                                        });
                                      }}
                                    >
                                      <option value={[null, null, null]}>
                                        Select a PHC
                                      </option>
                                      {this.state.phcs.map(item => {
                                        return (
                                          <option
                                            value={[
                                              ...item.value,
                                              item.label.replace(",", "||")
                                            ]}
                                          >
                                            {item.label}
                                          </option>
                                        );
                                      })}
                                    </FormSelect>
                                  </Col>
                                </Row>
                              </React.Fragment>
                            )}
                          {this.state.address_1_custom && (
                            <FormTextarea
                              // id="feEmailAddress"
                              type="text"
                              placeholder="Enter Second Address"
                              value={this.state.address_1}
                              onChange={e => {
                                console.log(e.target.value);
                                this.setState({ address_1: e.target.value });
                              }}
                              style={{ minHeight: "100px" }}
                            />
                          )}
                        </Col>
                        <Col md="3">
                          <label htmlFor="fePassword">Latitude</label>
                          <FormInput
                            type="number"
                            placeholder="Latitude"
                            value={this.state.lat_1}
                            disabled={!this.state.address_1_custom}
                            onChange={e => {
                              this.setState({ lat_1: e.target.value });
                            }}
                          />
                        </Col>
                        <Col md="3">
                          <label htmlFor="fePassword">Longitude</label>
                          <FormInput
                            type="number"
                            placeholder="Longitude"
                            value={this.state.lng_1}
                            disabled={!this.state.address_1_custom}
                            onChange={e => {
                              this.setState({ lng_1: e.target.value });
                            }}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          style={{
                            position: "relative",
                            top: "-10px",
                            left: "5px",
                            fontSize: "12px"
                          }}
                        >
                          <FormCheckbox
                            checked={this.state.address_1_custom}
                            onChange={e => {
                              console.log(e.target.checked);
                              this.setState({
                                address_1_custom: e.target.checked,
                                lat_1: "",
                                lng_1: "",
                                address_1: ""
                              });
                            }}
                          >
                            Use custom address and location
                          </FormCheckbox>
                        </Col>
                      </Row>
                    </React.Fragment>
                  )}
                  <Row>
                    <Col lg="4">
                      <label htmlFor="fePassword">Support contact</label>
                      <FormInput
                        type="text"
                        placeholder="Support contact"
                        value={this.state.support_contact}
                        onChange={e => {
                          // console.log(e.target.value);
                          let validation_test = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(
                            e.target.value
                          );
                          if (!e.target.value || e.target.value == "")
                            validation_test = true;
                          // console.log(validation_test);
                          if (validation_test) {
                            this.setState({ support_contact: e.target.value });
                            sessionStorage.setItem(
                              "support_contact",
                              e.target.value
                            );
                          }
                        }}
                      />
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col lg="4">
                      {" "}
                      <label htmlFor="fePassword">Query Radius (KM)</label>
                      <FormInput
                        type="number"
                        value={this.state.search_radius}
                        onChange={e => {
                          this.setState({ search_radius: e.target.value });
                        }}
                      />
                    </Col>
                  </Row>

                  <br />
                  <Row>
                    <Col>
                      <Button
                        onClick={async () => {
                          let response = await broadcastServiceRequest({
                            category: this.state.selected_category,
                            address_0: this.state.address_0,
                            location_0: [this.state.lat_0, this.state.lng_0],
                            address_1: this.state.add_second_address
                              ? this.state.address_1
                              : null,
                            location_1: this.state.add_second_address
                              ? [this.state.lat_1, this.state.lng_1]
                              : null,
                            requested_unit_count: this.state.number_of_units,
                            search_radius: this.state.search_radius
                              ? this.state.search_radius * 1000
                              : null,
                            support_contact: this.state.support_contact,
                            group: this.state.selected_group
                          });
                          console.log(response);
                          if (response) {
                            alert("Request broadcasted");
                            window.location.reload();
                          }
                        }}
                      >
                        Broadcast Request
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>

          {/* Sidebar Widgets */}
          {/* <Col lg="3" md="12">
            <SidebarActions />
            <SidebarCategories />
          </Col> */}
        </Row>
      </Container>
    );
  }
}

export default CreateNewRequest;
