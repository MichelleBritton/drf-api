import React, { useRef, useState } from "react";

import { useHistory } from "react-router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Image } from "react-bootstrap";

import Upload from "../../assets/upload.png";

import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import Asset from "../../components/Asset";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";

function PostCreateForm() {
  useRedirect("loggedOut");
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
    event.preventDefault()
    // Instantiate a formData object instance and append all three relevant peices of data: title, content and image
    const formData = new FormData();

    formData.append('title', title)
    formData.append('content', content)
    formData.append('image', imageInput.current.files[0])

    // Because we are sending an image file as well as text to our API we need to refresh the user's access token before we make a request to create a post.  For this, we will
    // import and use the axiosReq instance and post the formData to the posts endpoint of our API. Our API will respond with the data about our newly created post, including it's 
    // id. we can create a unique url for the new post by adding the post id to our posts/url string.
    try {
        const {data} = await axiosReq.post('/posts/', formData);
        history.push(`/posts/${data.id}`)
    } catch(err){
        // console.log(err)
        // In case there's an error with our API request, we'll log it out to the console and update the errors state variable only if the error isn't 401, as the user would
        // get redirected thanks to the interceptor logic
        if (err.response?.status !== 401){
            setErrors(err.response?.data)
        }
    }
  }


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
        create
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
                {/* Logic to display our image preview */}
                {image ? (
                    <>
                        <figure>
                        <Image className={appStyles.Image} src={image} rounded />
                        </figure>
                        <div>
                            <Form.Label className={`${btnStyles.Button} ${btnStyles.Blue} btn`} htmlFor="image-upload" >
                                Change the image
                            </Form.Label>
                        </div>
                    </>
                ) : (
                    <Form.Label className="d-flex justify-content-center" htmlFor="image-upload">
                        <Asset src={Upload} message="Click or tap to upload an image" />
                    </Form.Label>
                )}
                              
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

export default PostCreateForm;