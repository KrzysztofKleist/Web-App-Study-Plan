"use strict";

/**
 * Constructor function for new Course objects
 * @param {string} code
 * @param {string} name
 * @param {number} credits
 * @param {string} maxStudents
 * @param {number} incompatibileWith
 * @param {string} preparatoryCourse
 */

function Course(
  code,
  name,
  credits,
  maxStudents,
  incompatibileWith,
  preparatoryCourse
) {
  this.code = code;
  this.name = name;
  this.credits = credits;
  this.maxStudents = maxStudents;
  this.incompatibileWith = incompatibileWith;
  this.preparatoryCourse = preparatoryCourse;
}

exports.Course = Course;
