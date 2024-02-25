import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { Image } from "react-bootstrap";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { Alert } from "react-bootstrap";

import axios from "axios";
import { useRedirect } from "../../hooks/useRedirect";

const SignUpForm = () => {
  useRedirect('loggedIn');
  const [signUpData, setSignUpData] = useState({
    username: '',
    password1: '',
    password2: '',
  })
  // Destructure signUpData so we don't have to use dot notation  to access their values
  const { username, password1, password2 } = signUpData;

  // Make sure all appropriate errors are being displayed to the user. we'll call the useState
  // hook with an empty object, where we will stor all the errors
  const [errors, setErrors] = useState({});

  // After successful registration, we should be directed to the /signin page. To do this
  // we create a new variable called history and call teh useHistory hook that comes with react-router
  const history = useHistory();

  // onChange handler for when we try to type something into an input field so that it works
  // This function will accept an event as a parameter and call teh setSignUpData function inside
  // First we will have to spread the previous signUpData so that we only need to update our relevant
  // attribute and for this we are going to use teh computed property name javascript feature on event.target.name
  // and set it to event.target.value.  Essentially this line creates a key value pair, with the key being hte input 
  // field name and teh value being the value entered by teh user. This line means we can reuse this function to handle
  // changes to any of our input fields, instead of writing separate handlers for each.
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  // Form submit handler is an async funcion that accepts teh event as an argument. Inside we'll call preventDefault so
  // that the page doesn't refresh. Inside a try-catch block, we'll post all the signUpData to the endpoint in our API app
  // for user registration which is /dj-rest-auth/registration/. After successful registration, we should be redirected to
  // the /signin page.
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/dj-rest-auth/registration/', signUpData)
      history.push('/signin');
    } catch(err) {
      // This code with the question mark is called optional chaining. What it does is check if response is defined before
      // looking for the data. So if response isn't defined, it won't throw an error
      setErrors(err.response?.data)
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>sign up</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label className="d-none">username</Form.Label>
                <Form.Control 
                  className={styles.Input} 
                  type="text" 
                  placeholder="username" 
                  name="username" 
                  value={username} 
                  onChange={handleChange}
                />
            </Form.Group>
            {/* Now that we are storing the errors in the state, we can display them to the user when something goes wrong
            To do this we will map over the array of errors for each key in the error state. To do this, we'll use conditional 
            chaining again to check if the username key is in the errors object, and if so, then produce our alerts */}
            {errors.username?.map((message, idx) =>
              <Alert variant="warning" key={idx}>{message}</Alert>
            )}

            <Form.Group controlId="Password1">
                <Form.Label className="d-none">Password</Form.Label>
                <Form.Control 
                  className={styles.Input} 
                  type="password" 
                  placeholder="Password" 
                  name="password1" 
                  value={password1} 
                  onChange={handleChange}
                />
            </Form.Group>
            {errors.password1?.map((message, idx) =>
              <Alert variant="warning" key={idx}>{message}</Alert>
            )}

            <Form.Group controlId="Password2">
                <Form.Label className="d-none">Confirm Password</Form.Label>
                <Form.Control 
                  className={styles.Input} 
                  type="password" 
                  placeholder="Confirm password" 
                  name="password2"
                  value={password2} 
                  onChange={handleChange}
                />
            </Form.Group>
            {errors.password2?.map((message, idx) =>
              <Alert variant="warning" key={idx}>{message}</Alert>
            )}
            
            <Button className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`} type="submit">
                Sign up 
            </Button>
          </Form>
          {/* Non field errors i.e when the passwords don't match */}
          {errors.non_field_errors?.map((message, idx) =>
              <Alert variant="warning" key={idx} className="mt-3">{message}</Alert>
            )}

        </Container>
        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign in</span>
          </Link>
        </Container>
      </Col>
      <Col
        md={6}
        className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
      >
        <Image
          className={`${appStyles.FillerImage}`}
          src={
            "https://codeinstitute.s3.amazonaws.com/AdvancedReact/hero2.jpg"
          }
        />
      </Col>
    </Row>
  );
};

export default SignUpForm;