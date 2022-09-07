"use strict";

const { db } = require("./db");
const crypto = require("crypto");
const { resolve } = require("path");

// get user for login
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      } else {
        const user = {
          id: row.id,
          username: row.email,
          name: row.name,
          maxcredits: row.maxcredits,
        };

        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
          if (err) reject(err);
          if (
            !crypto.timingSafeEqual(
              Buffer.from(row.password, "hex"),
              hashedPassword
            )
          )
            resolve(false);
          else resolve(user);
        });
      }
    });
  });
};

// get user by id to get user info
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM user WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve({ error: "User not found!" });
      } else {
        const user = {
          id: row.id,
          username: row.email,
          name: row.name,
          maxcredits: row.maxcredits,
        };
        resolve(user);
      }
    });
  });
};

// change max credits (full-time, part-time, set 0 when deleting study plan)
exports.changeMaxCredits = (id, newCredits) => {
  return new Promise((resolve, reject) => {
    const sql = "UPDATE user SET maxcredits=? WHERE id=?";
    db.run(sql, [newCredits, id], function (err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
  });
};
