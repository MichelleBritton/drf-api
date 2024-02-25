import React, { useEffect, useRef, useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { title, content, image } = postData;

  const imageInput = useRef(null)

  // Define the history variable by using and importing the useHIstory books, so that we can redirect our users.
  const history = useHistory()

  // As the ide for the post is stored in the url, useParams to get a parameter out of a url
  const {id} = useParams();

  // Set up useEffect hook to handle our API request using the id parameter we just accessed
  // use axiosReq instance to get the data about our post, passing the id into the request string and we'll destructure the response into
  // the data variable here.  Assuming there are no errors, we can destructure the data we received back from the API, so we'll get the 
  // post title, content, image and a value for if the logged in user is the owner of hte post.  If the logged in user is not the owner 
  // they won't be able to edit it and the code in our API app would simply refuse to update it when the user tries to submit the form. However
  // a better user experience and more secure looking site would only allow the post owner to access teh edit post page in hte first place, and would
  // redirect any other users away so we can add this functionaility with a quick ternary that checks if the user is the post owner, if so teh postData
  // will be updated with the data. destructured above so that the input fields can be populated on mount.  In the second part of our ternary, if the user
  // isn't the post owner, we'll send them back to the home page of the site instead.
  useEffect(() => {
    const handleMount = async () => {
        try {
            // destructure response into data variable
            const {data} = await axiosReq.get(`/posts/${id}/`);
            // destructure data
            const {title, content, image, is_owner} = data;

            is_owner ? setPostData({title, content, image}) : history.push('/');
        } catch(err) {
            // console.log(err);
        }
    };

    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeImage = (event) => {
    // Check to see if a user has chosen a file to upload by checking if there is a file in teh files array
    if (event.target.files.length){
        // In case our user descides to change their image file after adding one, we also need to call URL.revokeObjectURl to clear the browser's reference to the previous file.
        URL.revokeObjectURL(image);
        // call the setPOstData function, spread postData and then set the image attribute's value using URL.createObjectURL, which creates a local link to the file passed into it
        // To access the file that has just been chosen, we have to access the files array on event.target and choose the first one.
        setPostData({
            ...postData,
            image: URL.createObjectURL(event.target.files[0])
        });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Instantiate a formData object instance and append all three relevant peices of data: title, content and image
    const formData = new FormData();

    formData.append('title', title);
    formData.append('content', content);

    // As we are using the state to display the image preview to the user, our file input element won't have a file in it unless the user uploads a new image so we first need
    // to check if the imageInput element has a file in it, before try to append it to the formData.  If it doesn't the original file will stay in place in our api.
    if (imageInput?.current?.files[0]){
        formData.append('image', imageInput.current.files[0]);
    }
    
    // .post changes to .put as we are updating an existing post instead of creating a new one
    try {
        await axiosReq.put(`/posts/${id}/`, formData);
        history.push(`/posts/${id}`);
    } catch(err){
        // console.log(err);
        // In case there's an error with our API request, we'll log it out to the console and update the errors state variable only if the error isn't 401, as the user would
        // get redirected thanks to the interceptor logic
        if (err.response?.status !== 401){
            setErrors(err.response?.data);
        }
    }
  };


  const textFields = (
    <div className="text-center">
        <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
            />
        </Form.Group>
        {errors.title?.map((message, idx) => (
            <Alert key={idx} variant="warning">
                {message}
            </Alert>
        ))}

        <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control
                as="textarea"
                rows={6}
                name="content"
                value={content}
                onChange={handleChange}
            />
        </Form.Group>
        {errors.content?.map((message, idx) => (
            <Alert key={idx} variant="warning">
                {message}
            </Alert>
        ))}
    
      <Button
        className={`${btnStyles.Button} ${btnStyles.Blue}`}
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button className={`${btnStyles.Button} ${btnStyles.Blue}`} type="submit">
        save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">   
                <figure>
                    <Image className={appStyles.Image} src={image} rounded />
                </figure>
                <div>
                    <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload" >
                        Change the image
                    </Form.Label>
                </div>
                                                  
                {/* Prop of image/* so that users can only upload images */}
                <Form.File id="image-upload" accept="image/*" onChange={handleChangeImage} ref={imageInput} />
                {errors.image?.map((message, idx) => (
                    <Alert key={idx} variant="warning">
                        {message}
                    </Alert>
                ))}

            </Form.Group>
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostEditForm;