import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from "react";
import { Table, Button } from "react-bootstrap";

function CourseTable(props) {
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
              key={crs.code}
              course={crs}
              userCoursesList={props.userCoursesList}
            />
          ))}
        </tbody>
      </Table>
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

export default CourseTable;
