import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function CourseUserTableEdit(props) {
  const navigate = useNavigate();

  // when canceling go back to courses path
  const handleClickCancel = (event) => {
    event.preventDefault();
    navigate("/courses");
    props.cancelSubmit();
  };

  // save new plan button
  const handleClickSave = (event) => {
    event.preventDefault();
    navigate("/courses");
    props.saveSubmit();
  };

  // constraint for range of credits
  const canSubmit =
    props.currentCredits <= props.userMaxCredits &&
    props.currentCredits >= props.userMaxCredits - 20;

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
                  userID={props.userID}
                  deleteUserCourse={props.deleteUserCourse}
                  currentUserCourses={props.currentUserCourses}
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
                {canSubmit ? (
                  <Button variant="success" onClick={handleClickSave}>
                    Submit changes
                  </Button>
                ) : (
                  <Button variant="danger">
                    To submit, meet the range of credits!
                  </Button>
                )}
              </div>
            </Col>
            <Col>
              <div className="d-flex justify-content-end">
                <Link to="/courses">
                  <Button variant="danger" onClick={handleClickCancel}>
                    Cancel
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <h2 style={{ marginTop: "40px" }}>No Study Plan found</h2>
          </Row>
          <div style={{ marginTop: "20px" }}>
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
                {canSubmit ? (
                  <Button
                    variant="success"
                    style={{ marginTop: "20px" }}
                    onClick={handleClickSave}
                  >
                    Submit changes
                  </Button>
                ) : (
                  <Button variant="danger" style={{ marginTop: "20px" }}>
                    To submit, meet the range of credits!
                  </Button>
                )}
              </div>
            </Col>
            <Col>
              <div className="d-flex justify-content-end">
                <Link to="/courses">
                  <Button
                    variant="danger"
                    style={{ marginTop: "20px" }}
                    onClick={handleClickCancel}
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
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

  // constraint for course that can't be removed
  const preparatoryCourses = props.currentUserCourses
    .filter((line) => line.preparatoryCourse != null)
    .map((line) => line.preparatoryCourse);

  let canDelete = true;

  if (preparatoryCourses.includes(props.course.code)) {
    canDelete = false;
  }

  return (
    <>
      <tr className={statusClass}>
        <CourseData
          course={props.course}
          userCoursesList={props.userCoursesList}
          canDelete={canDelete}
        />
        {expand ? (
          <HideButton expand={expand} setExpand={setExpand} />
        ) : (
          <ExpandButton expand={expand} setExpand={setExpand} />
        )}
        {canDelete ? (
          <TrashButton
            userID={props.userID}
            courseCode={props.course.code}
            deleteUserCourse={props.deleteUserCourse}
          />
        ) : (
          <TrashButtonDisabled />
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
      <td>
        {props.course.name}
        {props.canDelete ? null : (
          <div style={{ marginTop: "5px" }}>
            <p style={{ fontSize: "10px" }}>
              Can't delete a course that is preparatory for other course
            </p>
          </div>
        )}
      </td>

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
        <td></td>
      </tr>
      <tr className={"table-warning"}>
        <td></td>
        <td>Preparatory course: {props.course.preparatoryCourse}</td>
        <td></td>
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

function TrashButton(props) {
  const handleClick = (event) => {
    event.preventDefault();
    props.deleteUserCourse(props.userID, props.courseCode);
  };

  return (
    <td>
      <Button variant="danger" onClick={handleClick}>
        <i className="bi bi-trash3"></i>
      </Button>
    </td>
  );
}

function TrashButtonDisabled(props) {
  return (
    <td>
      <Button variant="secondary">
        <i className="bi bi-trash3"></i>
      </Button>
    </td>
  );
}

export default CourseUserTableEdit;
