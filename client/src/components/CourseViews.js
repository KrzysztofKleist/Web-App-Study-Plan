import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import CourseTable from "./CourseTable";
import CourseUserTable from "./CourseUserTable";
import CourseTableEdit from "./CourseTableEdit";
import CourseUserTableEdit from "./CourseUserTableEdit";
import { LoginForm, LogoutButton } from "./AuthComponents";

function DefaultRoute() {
  return (
    <>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Row>
          <Col>
            <h1>Nothing here...</h1>
            <p>This is not the route you are looking for!</p>
          </Col>
        </Row>
      </div>
    </>
  );
}

function LoginRoute(props) {
  return (
    <>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Row>
          <Col>
            <h1>Login</h1>
          </Col>
        </Row>
      </div>
      <Row>
        <Col>
          <LoginForm login={props.login} />
        </Col>
      </Row>
    </>
  );
}

function CourseRoute(props) {
  return (
    <Container className="App">
      <Row>
        <Col>
          <h1>All Courses</h1>
        </Col>
        <Col>
          <div className="d-flex justify-content-end">
            <Link to="/login">
              <Button variant="primary" size="lg">
                Login
              </Button>
            </Link>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <CourseTable
            courses={props.courses}
            userCoursesList={props.userCoursesList}
          />
        </Col>
      </Row>
    </Container>
  );
}

function UserCourseRoute(props) {
  return (
    <>
      <Row>
        <Col xs={6}>
          <h1>All Courses</h1>
        </Col>
        <Col xs={3}>
          <h1>My Courses</h1>
        </Col>
        <Col xs={3}>
          <div className="d-flex justify-content-end">
            <LogoutButton logout={props.logout} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <CourseTable
            courses={props.courses}
            userCoursesList={props.userCoursesList}
          />
        </Col>
        <Col>
          <CourseUserTable
            courses={props.courses}
            currentUserCourses={props.currentUserCourses}
            userCoursesList={props.userCoursesList}
            userID={props.userID}
            userMaxCredits={props.userMaxCredits}

            setMaxCreditsFull={props.setMaxCreditsFull}
            setMaxCreditsPart={props.setMaxCreditsPart}
            
            deleteAllUserCourses={props.deleteAllUserCourses}
            currentCredits={props.currentCredits}
          />
        </Col>
      </Row>
    </>
  );
}

function EditRoute(props) {
  return (
    <>
      <Row>
        <Col xs={6}>
          <h1>All Courses</h1>
        </Col>
        <Col xs={3}>
          <h1>My Courses</h1>
        </Col>
        <Col xs={3}>
          <div className="d-flex justify-content-end">
            <LogoutButton logout={props.logout} />
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <CourseTableEdit
            courses={props.courses}
            currentUserCourses={props.currentUserCourses}
            userCoursesList={props.userCoursesList}
            userID={props.userID}
            addUserCourse={props.addUserCourse}
          />
        </Col>
        <Col>
          <CourseUserTableEdit
            courses={props.courses}
            currentUserCourses={props.currentUserCourses}
            userCoursesList={props.userCoursesList}
            userID={props.userID}
            userMaxCredits={props.userMaxCredits}
            deleteUserCourse={props.deleteUserCourse}
            cancelSubmit={props.cancelSubmit}
            saveSubmit={props.saveSubmit}
            setCurrentCredits={props.setCurrentCredits}
            currentCredits={props.currentCredits}
          />
        </Col>
      </Row>
    </>
  );
}

export { DefaultRoute, CourseRoute, LoginRoute, UserCourseRoute, EditRoute };
