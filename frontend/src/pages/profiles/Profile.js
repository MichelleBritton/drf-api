import React from 'react';
import styles from '../../styles/Profile.module.css';
import btnStyles from '../../styles/Button.module.css';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { Button } from 'react-bootstrap';
import { useSetProfileData } from '../../contexts/ProfileDataContext';

const Profile = (props) => {
    const {profile, mobile, imageSize=55} = props;
    // Also need to access the data within the profile object so we'll destructure variables from it
    const {id, following_id, image, owner} = profile;

    // we also need to know if the logged in user is teh owner of the profile
    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const {handleFollow, handleUnfollow} = useSetProfileData();

    return (
        <div className={`my-3 d-flex align-items-center ${mobile && 'flex-column'}`}>
            <div>
                <Link className="align-self-center" to={`/profiles/${id}`}>
                    <Avatar src={image} height={imageSize} />
                </Link>
            </div>
            <div className={`mx-2 ${styles.WordBreak}`}>
                <strong>{owner}</strong>
            </div>
            <div className={`text-right ${!mobile && 'ml-auto'}`}>
                {/* Add the not-mobilel condition to check if we are on desktop, then we'll check if the currentUser exists so we know our user is logged in and finally
                we'll also check if the user is not the owner of hte profile because our users won't be able to follow themselves */}
                {!mobile && currentUser && !is_owner && (
                    // We know we need to display a follow button to our user for this profile but should it be follow or unfollow? If the logged in user has followed the
                    // profile, then a following_id prop from our API response won't be null, so we can use this in a ternary. If the following_id does exist, we'll display
                    // the unfollow button
                    following_id ? (
                        <Button 
                            className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                            onClick={() => handleUnfollow(profile)}
                        >
                            unfollow
                        </Button>
                    ) : (
                        <Button
                            className={`${btnStyles.Button} ${btnStyles.Black}`}
                            onClick={() => handleFollow(profile)}
                        >
                            follow
                        </Button>
                    )
                )}
            </div>
        </div>
    );
};

export default Profile;