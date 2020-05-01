import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button
} from "shards-react";
import { api_url } from "../utils/constants";
import axios from "axios";
import PageTitle from "../components/common/PageTitle";
import { Link } from "react-router-dom";
const getRequestList = async showExpired => {
  let url = `${api_url}/service/request/list?a=1`;
  let role = sessionStorage.getItem("user_role");
  if (role) {
    url += `&role=${role}`;
  }
  if (showExpired) {
    url += `&show_expired=true`;
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
class RequestList extends Component {
  state = { requests: [], showExpired: false };
  componentDidMount() {
    if (!sessionStorage.getItem("access_token"))
      window.location.assign("/#/login");
    this.getRequests();
    setInterval(this.getRequests, 10000);
  }
  getRequests = async () => {
    let requests = await getRequestList(this.state.showExpired);
    console.log(requests);
    this.setState({ requests });
  };
  render() {
    return (
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle
            sm="6"
            title={this.state.showExpired ? "All Requests" : "Active Requests"}
            subtitle="This list contains a list of requests and their correspondind statuses."
            className="text-sm-left"
          />
        </Row>

        {/* Default Light Table */}
        <Row>
          <Col>
            <Button
              onClick={() => {
                this.setState({ showExpired: !this.state.showExpired }, () => {
                  this.getRequests();
                });
              }}
            >
              {this.state.showExpired ? "Hide Expired" : "Show Expired"}
            </Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Card small className="mb-4">
              {/* <CardHeader className="border-bottom">
                      <h6 className="m-0">Active Users</h6>
                    </CardHeader> */}
              <CardBody className="p-0 pb-3">
                <table className="table mb-0 table-responsive-sm table-responsive-md table-striped">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                        #
                      </th>
                      <th scope="col" className="border-0">
                        Category
                      </th>
                      <th scope="col" className="border-0">
                        Pickup Address
                      </th>
                      <th scope="col" className="border-0">
                        Destination Address
                      </th>
                      {/* <th scope="col" className="border-0">
                        City
                      </th> */}
                      <th scope="col" className="border-0">
                        Requested
                      </th>
                      <th scope="col" className="border-0">
                        Available
                      </th>
                      <th scope="col" className="border-0">
                        Responded
                      </th>
                      <th scope="col" className="border-0">
                        Picked up
                      </th>
                      <th scope="col" className="border-0">
                        More
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.requests.map((request, i) => {
                      // if (
                      //   request.categoryDetails &&
                      //   request.categoryDetails.id == 1
                      // )
                      return (
                        <tr>
                          <td>{i + 1}</td>
                          <td>
                            {request.categoryDetails
                              ? request.categoryDetails.title
                              : "-"}
                          </td>
                          <td>{request.address_0}</td>
                          <td>
                            {request.address_1
                              ? request.address_1
                              : "Not Applicable"}
                          </td>

                          <td>{request.requested_unit_count}</td>
                          <td>{request.notified_units.length}</td>
                          <td>{request.responded_unit_count}</td>
                          <td>
                            <p
                              style={{
                                margin: "0px",
                                backgroundColor:
                                  request.responded_units &&
                                  request.picked_up_units &&
                                  request.responded_units.length ===
                                    request.picked_up_units.length
                                    ? "rgb(181, 255, 184)"
                                    : "rgb(255, 232, 151)",
                                textAlign: "center",
                                width: "100px",
                                borderRadius: "5px"
                              }}
                            >
                              <span>
                                {request.picked_up_units
                                  ? request.picked_up_units.length
                                  : 0}
                              </span>
                              <span style={{ margin: "0px 8px" }}>of</span>
                              <span>
                                {request.responded_units
                                  ? request.responded_units.length
                                  : 0}
                              </span>
                            </p>
                          </td>
                          <td>
                            <Link to={`/dashboard/requests/${request.id}`}>
                              <Button>More info</Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}
export default RequestList;
