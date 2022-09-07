import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Form, Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    props.login(credentials);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Form.Group controlId="username">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required={true}
          />
        </Form.Group>
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required={true}
            minLength={4}
          />
        </Form.Group>
      </div>
      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Button type="submit">Login</Button>
      </div>

      <div
        className="d-flex justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Link to="/">
          <Button type="submit">Back to main page</Button>
        </Link>
      </div>
    </Form>
  );
}

function LogoutButton(props) {
  return (
    // <div className="d-flex justify-content-end">
    <Button variant="primary" size="lg" onClick={props.logout}>
      Logout
    </Button>
    // </div>
  );
}

export { LoginForm, LogoutButton };
