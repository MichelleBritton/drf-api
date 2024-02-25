import React, { useState } from 'react';
import styles from '../../styles/Comment.module.css';
import { Media } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { MoreDropdown } from "../../components/MoreDropdown";
import { axiosRes } from '../../api/axiosDefaults';
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
    const { 
        profile_id, 
        profile_image, 
        owner, 
        updated_at, 
        content,
        id,
        setPost,
        setComments,
    } = props;

    const [showEditForm, setShowEditForm] = useState(false);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    // To successfully delete a comment, we'll have to decrement the post comments_count and filter out the deleted comment from teh comments array from our state
    // To do that, we'll need to access both setPost and setComments functions inside teh comment component, so we'll have to pass them both as props to our comment component
    // in PostPage.js and then add them to destructured props alongside comment_id, above.

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}/`);
            // If everything goes well with the request, we'll need to update the post results array with our new comments count
            // Inside the array, we'll spread the previous post object and reduce it's comments_count by one. 
            setPost((prevPost) => ({
                results: [
                    {
                        ...prevPost.results[0],
                        comments_count: prevPost.results[0].comments_count - 1,
                    },
                ],
            }));

            // With the comments count on the post updated, we need to remove the deleted comment from our state.
            // Call the setComments function and return an object, where we'll only update teh results array. We want to remove the comment that matches our id so we'll call
            // the filter function to loop over the previous comments' results array. If the id is for the comment we want to remove our filter method will not return it into
            // the updated results array
            setComments((prevComments) => ({
                ...prevComments,
                results: prevComments.results.filter((comment) => comment.id !== id),
            }));
        } catch(err) {}
    };

    return (
        <>
          <hr />
          <Media>
            <Link to={`/profiles/${profile_id}`}>
              <Avatar src={profile_image} />
            </Link>
            <Media.Body className="align-self-center ml-2">
              <span className={styles.Owner}>{owner}</span>
              <span className={styles.Date}>{updated_at}</span>
              {showEditForm ? (
                <CommentEditForm
                    id={id}
                    profile_id={profile_id}
                    content={content}
                    profileImage={profile_image}
                    setComments={setComments}
                    setShowEditForm={setShowEditForm}
                />
              ) : (
                <p>{content}</p>
              )}
            </Media.Body>
            {is_owner && !showEditForm && (
              <MoreDropdown
                handleEdit={() => setShowEditForm(true)}
                handleDelete={handleDelete}
              />
            )}
          </Media>
        </>
      );
};

export default Comment;