import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { Container, Row, Alert } from "react-bootstrap";
import {
  DefaultRoute,
  LoginRoute,
  UserCourseRoute,
  CourseRoute,
  EditRoute,
} from "./components/CourseViews";
// import { LogoutButton } from "./components/AuthComponents";

import API from "./API";
import UserCourse from "./UserCourse";

function App() {
  const [courses, setCourses] = useState([]);
  const [userCoursesList, setUserCoursesList] = useState([]);

  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");

  const [userID, setUserID] = useState("");
  const [userMaxCredits, setUserMaxCredits] = useState("");

  const [currentCredits, setCurrentCredits] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      // when reloading page
      const user = await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);

      setUserID(user.id.toString());
    };
    const getUser = async () => {
      const user = await API.getUserById(userID);
      if (user.maxcredits == null) {
        setUserMaxCredits("0");
      } else {
        setUserMaxCredits(user.maxcredits.toString());
      }
    };
    checkAuth();
    getUser();
  }, [userID]); // userID needed in API.getUserById(userID)

  const getCourses = async () => {
    // getting courses table
    const courses = await API.getAllCourses();
    courses.sort(function (a, b) {
      return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
    });
    setCourses(courses);
    // setMessage({ msg: "Loading complete!", type: "success" });
    return courses;
  };

  const getUserCoursesList = async () => {
    // getting usercourses table
    const userCoursesList = await API.getUserCourses();
    setUserCoursesList(userCoursesList);
  };

  useEffect(() => {
    // get courses and usercourses tables when user changes
    getCourses();
    getUserCoursesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  const userCourses = userCoursesList // getting userCourses list of codes for current user
    // eslint-disable-next-line eqeqeq
    .filter((line) => line.userid == userID)
    .map((line) => line.coursecode);

  const currentUserCourses = courses.filter(
    (
      line // full list of courses info for current user
    ) => userCourses.includes(line.code)
  );

  let currCredits = 0;
  if (!(currentUserCourses.length === 0)) {
    // counting current credits for current user
    currCredits = currentUserCourses
      .map((crs) => crs.credits)
      .reduce((prev, next) => prev + next);
  }

  useEffect(() => {
    // set useState of currentCredits whenever it changes
    setCurrentCredits(currCredits);
  }, [currCredits]);

  const addUserCourse = async (userid, coursecode) => {
    // add new element to usercourse table (only front-end)
    const userCourse = new UserCourse(userid, coursecode);
    setUserCoursesList((oldUserCoursesList) => [
      ...oldUserCoursesList,
      userCourse,
    ]);
  };

  const deleteUserCourse = async (userid, coursecode) => {
    const newUserCoursesList = userCoursesList.filter(
      // delete old element from usercourse table (only front-end)
      // eslint-disable-next-line eqeqeq
      (crs) => crs.userid != userid || crs.coursecode != coursecode
    );
    // set new useState with deleted course
    setUserCoursesList(newUserCoursesList);
  };

  const createUserCourse = async (usercourse) => {
    // function for creating new course in back end
    await API.createUserCourse(usercourse);
  };

  const deleteAllUserCourses = async (userid) => {
    // function to wipe usercourse table
    const newUserCoursesList = userCoursesList.filter(
      // setting temporary table in front end
      // eslint-disable-next-line eqeqeq
      (crs) => crs.userid != userid
    );
    await API.deleteAllUserCourses();
    newUserCoursesList.forEach(async function (line) {
      // creating new usercourse table in a loop
      await createUserCourse(line);
    });
    await getUserCoursesList();
    await API.updateMaxCredits(userID, 0);

    const user = await API.getUserById(userID);
    if (user.maxcredits === null) {
      // realoading values of current credits after changes in usercourse table
      setUserMaxCredits("0");
    } else {
      setUserMaxCredits(user.maxcredits.toString());
    }
  };

  const setMaxCreditsFull = async () => {
    // setting credits when full-time is chosen
    await API.updateMaxCredits(userID, 80);

    const user = await API.getUserById(userID);
    if (user.maxcredits === null) {
      setUserMaxCredits("0");
    } else {
      setUserMaxCredits(user.maxcredits.toString());
    }
  };

  const setMaxCreditsPart = async () => {
    // setting credits when part-time is chosen
    await API.updateMaxCredits(userID, 40);

    const user = await API.getUserById(userID);
    if (user.maxcredits === null) {
      setUserMaxCredits("0");
    } else {
      setUserMaxCredits(user.maxcredits.toString());
    }
  };

  const cancelSubmit = async () => {
    // don't change anything in back end when cancelling
    getUserCoursesList();
  };

  const saveSubmit = async () => {
    // update usercourse table when saved
    const newUserCoursesList = userCoursesList;
    await API.deleteAllUserCourses();
    newUserCoursesList.forEach(async function (line) {
      await createUserCourse(line);
    });
    await getUserCoursesList();
  };

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);

      setUserID(user.id.toString());
      if (user.maxcredits === null) {
        setUserMaxCredits("0");
      } else {
        setUserMaxCredits(user.maxcredits.toString());
      }
      setMessage({
        msg: `Welcome, ${user.name}!`,
        type: "success",
      });
    } catch (err) {
      console.log(err);
      setMessage({ msg: err, type: "danger" });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);

    setUserID("");
    setUserMaxCredits("0");

    setMessage({
      msg: `Logout succesful!`,
      type: "primary",
    });
  };

  return (
    <Container className="App">
      {/* <Row>Logged in: {loggedIn.toString()}</Row>
      <Row>Logged in user ID: {userID}</Row>
      <Row>Logged in user Max Credits: {userMaxCredits}</Row> */}
      {/* {loggedIn && <LogoutButton logout={handleLogout} />} */}
      {message && (
        <Row>
          <Alert
            variant={message.type}
            onClose={() => setMessage("")}
            dismissible
          >
            {message.msg}
          </Alert>
        </Row>
      )}
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              !loggedIn ? (
                <CourseRoute
                  courses={courses}
                  userCoursesList={userCoursesList}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/courses" />
              ) : (
                <LoginRoute login={handleLogin} />
              )
            }
          />
          <Route
            path="/courses"
            element={
              loggedIn ? (
                <UserCourseRoute
                  logout={handleLogout}
                  courses={courses}
                  currentUserCourses={currentUserCourses}
                  userCoursesList={userCoursesList}
                  userID={userID}
                  userMaxCredits={userMaxCredits}
                  deleteAllUserCourses={deleteAllUserCourses}
                  setCurrentCredits={setCurrentCredits}
                  currentCredits={currentCredits}
                  setMaxCreditsFull={setMaxCreditsFull}
                  setMaxCreditsPart={setMaxCreditsPart}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route
            path="/edit"
            element={
              loggedIn ? (
                <EditRoute
                  logout={handleLogout}
                  courses={courses}
                  currentUserCourses={currentUserCourses}
                  userCoursesList={userCoursesList}
                  userID={userID}
                  userMaxCredits={userMaxCredits}
                  addUserCourse={addUserCourse}
                  deleteUserCourse={deleteUserCourse}
                  cancelSubmit={cancelSubmit}
                  saveSubmit={saveSubmit}
                  setCurrentCredits={setCurrentCredits}
                  currentCredits={currentCredits}
                />
              ) : (
                <Navigate replace to="/login" />
              )
            }
          />
          <Route path="*" element={<DefaultRoute />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
