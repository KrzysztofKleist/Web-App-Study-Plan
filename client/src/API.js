import Course from "./Course";
import UserCourse from "./UserCourse";

const SERVER_URL = "http://localhost:3001";

// get all from courses table
const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses", {
    credentials: "include",
  });
  const coursesJson = await response.json();
  if (response.ok) {
    return coursesJson.map(
      (crs) =>
        new Course(
          crs.code,
          crs.name,
          crs.credits,
          crs.maxStudents,
          crs.incompatibileWith,
          crs.preparatoryCourse
        )
    );
  } else throw coursesJson;
};

// get all from usercourses table
const getUserCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/usercourses", {
    credentials: "include",
  });
  const usercoursesJson = await response.json();
  if (response.ok) {
    return usercoursesJson.map(
      (crs) => new UserCourse(crs.userid, crs.coursecode)
    );
  } else throw usercoursesJson;
};

// wipe usercourses table
const deleteAllUserCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/usercourses", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
  else {
    const errMessage = await response.json();
    throw errMessage;
  }
};

// create one usercourse
const createUserCourse = async (usercourse) => {
  const response = await fetch(SERVER_URL + "/api/usercourse", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userid: usercourse.userid,
      coursecode: usercourse.coursecode,
    }),
  });
  if (response.ok) return null;
  else {
    const errMessage = await response.json();
    throw errMessage;
  }
};

// get user info by id (for updating maxCredits in front end)
const getUserById = async (userID) => {
  const response = await fetch(SERVER_URL + "/api/user", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: userID,
    }),
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

// update max credits when changing full/part time
const updateMaxCredits = async (userID, maxCredits) => {
  const response = await fetch(SERVER_URL + "/api/user", {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: userID,
      maxcredits: maxCredits,
    }),
  });
  if (response.ok) return null;
  else {
    const errMessage = await response.json();
    throw errMessage;
  }
};

// login
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

// get info in current session
const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    credentials: "include",
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user; // an object with the error coming from the server
  }
};

// logout
const logOut = async () => {
  const response = await fetch(SERVER_URL + "/api/sessions/current", {
    method: "DELETE",
    credentials: "include",
  });
  if (response.ok) return null;
};

const API = {
  getAllCourses,
  getUserCourses,
  deleteAllUserCourses,
  createUserCourse,
  getUserById,
  updateMaxCredits,
  logIn,
  getUserInfo,
  logOut,
};
export default API;
