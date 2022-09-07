import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function CourseUserTable(props) {
  const navigate = useNavigate();
  const [chooseCredits, setChooseCredits] = useState(false);

  // changes of maxCredits when creating new study plan
  const handleClickChooseCredits = (event) => {
    event.preventDefault();
    setChooseCredits(true);
  };

  const handleClickCreditsFullTime = (event) => {
    event.preventDefault();
    navigate("/edit");
    props.setMaxCreditsFull();
  };

  const handleClickCreditsPartTime = (event) => {
    event.preventDefault();
    navigate("/edit");
    props.setMaxCreditsPart();
  };

  // manages cancel of creating study plan
  const handleClickCancel = (event) => {
    event.preventDefault();
    setChooseCredits(false);
  };

  // deleting existing study plan
  const handleClick = (event) => {
    event.preventDefault();
    props.deleteAllUserCourses(props.userID);
  };

  return (
    <>
      {Boolean(props.currentUserCourses.length) ? (
        <>
          <Table striped>
            <thead>
              <tr>
                <th>Code</th>
                <th>Course</th>
                <th style={{ textAlign: "center" }}>Credits</th>
                <th style={{ textAlign: "center" }}>Registered Students</th>
                <th style={{ textAlign: "center" }}>Max Students</th>
              </tr>
            </thead>
            <tbody>
              {props.currentUserCourses.map((crs) => (
                <CourseRow
                  course={crs}
                  key={crs.code}
                  userCoursesList={props.userCoursesList}
                />
              ))}
            </tbody>
          </Table>
          <div style={{ marginBottom: "20px" }}>
            <Row>
              <Col>
                <div className="d-flex justify-content-start">
                  Your credits: {props.currentCredits}
                </div>
              </Col>
              <Col>
                <div className="d-flex justify-content-center">
                  Min credits: {props.userMaxCredits - 20}
                </div>
              </Col>
              <Col>
                <div className="d-flex justify-content-end">
                  Max credits: {props.userMaxCredits}
                </div>
              </Col>
            </Row>
          </div>
          <Row>
            <Col>
              <div className="d-flex justify-content-start">
                <Link to="/edit">
                  <Button variant="primary">Edit your Study Plan</Button>
                </Link>
              </div>
            </Col>
            <Col>
              <div className="d-flex justify-content-end">
                <Button variant="danger" onClick={handleClick}>
                  Delete your Study Plan
                </Button>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {" "}
          {!chooseCredits ? (
            <>
              <Row>
                <h2 style={{ marginTop: "40px" }}>No Study Plan found</h2>
              </Row>
              <Row>
                <Col>
                  <div
                    className="d-flex justify-content-start"
                    style={{ marginTop: "20px" }}
                  >
                    <Button
                      variant="primary"
                      onClick={handleClickChooseCredits}
                    >
                      Create your Study Plan
                    </Button>
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <h2 style={{ marginTop: "40px" }}>
                  Choose an option for your study plan
                </h2>
              </Row>
              <Row>
                <Col>
                  <div
                    className="d-flex justify-content-start"
                    style={{ marginTop: "20px" }}
                  >
                    <Link to="/edit">
                      <Button
                        variant="primary"
                        onClick={handleClickCreditsFullTime}
                      >
                        Full-time
                      </Button>
                    </Link>
                  </div>
                </Col>
                <Col>
                  <div
                    className="d-flex justify-content-center"
                    style={{ marginTop: "20px" }}
                  >
                    <Link to="/edit">
                      <Button
                        variant="primary"
                        onClick={handleClickCreditsPartTime}
                      >
                        Part-time
                      </Button>
                    </Link>
                  </div>
                </Col>
                <Col>
                  <div
                    className="d-flex justify-content-end"
                    style={{ marginTop: "20px" }}
                  >
                    <Link to="/courses">
                      <Button variant="danger" onClick={handleClickCancel}>
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </>
      )}
    </>
  );
}

function CourseRow(props) {
  const [expand, setExpand] = useState(false); // useState for expanding row

  let statusClass = null;

  if (expand) {
    statusClass = "table-warning";
  } else {
    statusClass = "";
  }

  return (
    <>
      <tr className={statusClass}>
        <CourseData
          course={props.course}
          userCoursesList={props.userCoursesList}
        />
        {expand ? (
          <HideButton expand={expand} setExpand={setExpand} />
        ) : (
          <ExpandButton expand={expand} setExpand={setExpand} />
        )}
      </tr>
      {expand ? <CourseAdditionalData course={props.course} /> : ""}
    </>
  );
}

function CourseData(props) {
  // counting current students registered in a course
  let numOfStudents = props.userCoursesList.filter(
    (line) => line.coursecode === props.course.code
  ).length;
  if (numOfStudents === 0) {
    numOfStudents = undefined;
  }

  return (
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td style={{ textAlign: "center" }}>{props.course.credits}</td>
      <td style={{ textAlign: "center" }}>{numOfStudents}</td>
      <td style={{ textAlign: "center" }}>{props.course.maxStudents}</td>
    </>
  );
}

function CourseAdditionalData(props) {
  return (
    <>
      <tr className={"table-warning"}>
        <td></td>
        <td>Incompatibile with: {props.course.incompatibileWith}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr className={"table-warning"}>
        <td></td>
        <td>Preparatory course: {props.course.preparatoryCourse}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </>
  );
}

function ExpandButton(props) {
  return (
    <td>
      <Button
        variant="primary"
        onClick={() => {
          props.setExpand(true);
        }}
      >
        <i className="bi bi-arrow-down-circle"></i>
      </Button>
    </td>
  );
}

function HideButton(props) {
  return (
    <td>
      <Button
        variant="warning"
        onClick={() => {
          props.setExpand(false);
        }}
      >
        <i className="bi bi-arrow-up-circle"></i>
      </Button>
    </td>
  );
}

export default CourseUserTable;
