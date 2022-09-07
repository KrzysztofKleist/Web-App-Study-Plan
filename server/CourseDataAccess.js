"use strict";
/* Data Access Object (DAO) module for accessing courses */

const { Course } = require("./modules/Course");
const { UserCourse } = require("./modules/UserCourse");
const { db } = require("./db");

// get all courses
exports.listCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM courses";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const courses = rows.map(
          (row) =>
            new Course(
              row.code,
              row.name,
              row.credits,
              row.maxStudents,
              row.incompatibileWith,
              row.preparatoryCourse
            )
        );
        resolve(courses);
      }
    });
  });
};

// get all usercourses
exports.listUserCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM usercourses";
    db.all(sql, [], (err, rows) => {
      if (err) reject(err);
      else {
        const usercourses = rows.map(
          (row) => new UserCourse(row.userid, row.coursecode)
        );
        resolve(usercourses);
      }
    });
  });
};

// delete all usercourses
exports.deleteUserCourses = () => {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM usercourses";
    db.run(sql, [], (err) => {
      if (err) reject(err);
      else resolve(null);
    });
  });
};

// add a new usercourse
exports.addUserCourse = (usercourse) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO usercourses(userid, coursecode) VALUES(?, ?)";
    db.run(sql, [usercourse.userid, usercourse.coursecode], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
