import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import appStyles from "../../App.module.css";

import { useParams } from "react-router";

import { axiosReq } from "../../api/axiosDefaults";
import Post from "./Post";
import Comment from "../comments/Comment";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
import PopularProfiles from "../profiles/PopularProfiles";

function PostPage() {
    // The way to access url parameters using the react router library is to use and auto-import the useParams hook and destructure it in place
    // with the name of the parameter that we set in the route, which was id.
    const {id } = useParams();

    // Now that we have the id of the post that we'd like to fetch, store it in the state. If we ask for a single post we'll get a single object returned, if
    // we have for multiple posts, we'll get an array of objects so to make all future logic compatible with arrays of posts, we'll set the initial value to an object
    // that contain an empty array of results, that way we can always operate on the results array regardless of whether we get a single post object or an array of posts
    const [post, setPost] = useState({results: []});

    const currentUser = useCurrentUser();
    const profile_image = currentUser?.profile_image;
    const [comments, setComments] = useState({ results: [] });

    // Fetch the post on mount and as we're about to make a network request, create a try/catch block too
    useEffect(() => {
        const handleMount = async () => {
            // Inside the try block we'll make our request to the API. We will be making two requests, one for post and one for its comments so it will be a little different
            try {
                // Here we are destructuring the data property returned from teh API and renaming it to post, renaming an object key is another nice destructuring feature, allowing
                // us to give our variable a more meaningful name.  What Promise.all does is it accepts an array of promises and gets resolved when all the promises get resolved, returning
                // an array of data. If any of the promises in the array fail, Promise.all gets rejected with an error. In this case the data returned is the post we requested
                const [{data: post}, {data: comments}] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                    axiosReq.get(`/comments/?post=${id}`)
                ]);
                setPost({results: [post]});
                setComments(comments);
            } catch(err){
                // console.log(err);
            }
        };

        // Call handleMount and run this code everytime the post id in the url changes
        handleMount();
    }, [id]);


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        {/* Spread teh post object from teh results array so that its key value pairs are passed in as props. We'll also pass the setPost function which we will use later to handle our likes. We don't need to give teh PostPage prop
        a value here, simply applying it means it will be returned as true inside our post component */}
        <Post {...post.results[0]} setPosts={setPost} postPage />
        
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              post={id}
              setPost={setPost}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll 
              children={comments.results.map((comment) => (
                // Spread the comment object so that its contents are passed as props
                <Comment
                  key={comment.id}
                  {...comment}
                  setPost={setPost}
                  setComments={setComments}
                />
                ))}
                dataLength={comments.results.length}
                loader={<Asset spinner />}
                // !! operator returns true or false
                hasMore={!!comments.next}
                // This prop accepts a function that will be called to load the next page of results if the hasMore prop is true
                next={() => fetchMoreData(comments, setComments)}
            />               
            ) : currentUser ? (
              <span>No comments yet, be the first to comment!</span>
            ) : (
              <span>No comments... yet</span>
            )}
          </Container>
        </Col>
        <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
          <PopularProfiles />
        </Col>
      </Row>
    );
  }
  
  export default PostPage;