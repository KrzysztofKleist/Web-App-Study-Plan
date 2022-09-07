"use strict";

/**
 * Constructor function for new Course objects
 * @param {number} userid
 * @param {string} coursecode
 */

function UserCourse(userid, coursecode) {
  this.userid = userid;
  this.coursecode = coursecode;
}

exports.UserCourse = UserCourse;
