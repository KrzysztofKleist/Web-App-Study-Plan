import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button } from "react-bootstrap";

function CourseTableEdit(props) {
  return (
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
          {props.courses.map((crs) => (
            <CourseRow
              course={crs}
              key={crs.code}
              currentUserCourses={props.currentUserCourses}
              userCoursesList={props.userCoursesList}
              userID={props.userID}
              addUserCourse={props.addUserCourse}
            />
          ))}
        </tbody>
      </Table>
    </>
  );
}

function CourseRow(props) {
  const [expand, setExpand] = useState(false); // useState for expanding row

  // counting current students registered in a course
  let numOfStudents = props.userCoursesList.filter(
    (line) => line.coursecode === props.course.code
  ).length;
  if (numOfStudents === 0) {
    numOfStudents = undefined;
  }

  let statusClass = null;
  let canAdd = true;
  let message = ""; // messages depend on different constraints

  // color of row when expanded
  if (expand) {
    statusClass = "table-warning";
  } else {
    statusClass = "";
  }

  // constraint for max students in a course
  if (
    numOfStudents >= props.course.maxStudents &&
    props.course.maxStudents != null
  ) {
    message = "Course already full";
    statusClass = "table-danger";
    canAdd = false;
  }

  // constraint for course that is already in current user's study plan
  if (props.currentUserCourses.includes(props.course)) {
    message = "Already in the study plan";
    statusClass = "table-danger";
    canAdd = false;
  }

  // constraint for courses incompatibile
  const coursesIncompatibile = props.currentUserCourses
    .filter((line) => line.incompatibileWith != null)
    .map((line) => line.incompatibileWith.replaceAll(" ", "").split(","))
    .flat();

  if (coursesIncompatibile.includes(props.course.code)) {
    message = "Incompatibile with one of the courses in the study plan";
    statusClass = "table-danger";
    canAdd = false;
  }

  // constraint for preparatory course
  if (
    !(
      props.currentUserCourses
        .map((line) => line.code)
        .includes(props.course.preparatoryCourse) ||
      props.course.preparatoryCourse == null
    )
  ) {
    message = "Preparatory course not included in current study plan";
    statusClass = "table-danger";
    canAdd = false;
  }

  return (
    <>
      <tr className={statusClass}>
        <CourseData
          course={props.course}
          userCoursesList={props.userCoursesList}
          canAdd={canAdd}
          message={message}
          numOfStudents={numOfStudents}
        />
        {expand ? (
          <HideButton expand={expand} setExpand={setExpand} />
        ) : (
          <ExpandButton expand={expand} setExpand={setExpand} />
        )}
        {canAdd ? (
          <AddButton
            userID={props.userID}
            courseCode={props.course.code}
            addUserCourse={props.addUserCourse}
          />
        ) : (
          <AddButtonDisabled />
        )}
      </tr>
      {expand ? (
        <CourseAdditionalData course={props.course} canAdd={canAdd} />
      ) : (
        ""
      )}
    </>
  );
}

function CourseData(props) {
  return (
    <>
      <td>{props.course.code}</td>
      <td>
        {props.course.name}
        {props.canAdd ? null : (
          <div style={{ marginTop: "5px" }}>
            <p style={{ fontSize: "10px" }}>{props.message}</p>
          </div>
        )}
      </td>
      <td style={{ textAlign: "center" }}>{props.course.credits}</td>
      <td style={{ textAlign: "center" }}>{props.numOfStudents}</td>
      <td style={{ textAlign: "center" }}>{props.course.maxStudents}</td>
    </>
  );
}

function CourseAdditionalData(props) {
  let statusClass = null; // changing color when expanding depending if constrained
  if (props.canAdd) {
    statusClass = "table-warning";
  } else {
    statusClass = "table-danger";
  }

  return (
    <>
      <tr className={statusClass}>
        <td></td>
        <td>Incompatibile with: {props.course.incompatibileWith}</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr className={statusClass}>
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

function AddButton(props) {
  const handleClick = (event) => {
    // updating useState of usercourse
    event.preventDefault();
    props.addUserCourse(props.userID, props.courseCode);
  };

  return (
    <td>
      <Button variant="success" onClick={handleClick}>
        <i className="bi bi-plus-circle"></i>
      </Button>
    </td>
  );
}

function AddButtonDisabled(props) {
  // disabled when constrained
  return (
    <td>
      <Button variant="secondary">
        <i className="bi bi-plus-circle"></i>
      </Button>
    </td>
  );
}

export default CourseTableEdit;
