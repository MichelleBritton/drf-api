import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Asset from "../../components/Asset";

import styles from "../../styles/ProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData, } from "../../contexts/ProfileDataContext";
import { Button, Image } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "../posts/Post";
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/no-results.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";


function ProfilePage() {
  const [hasLoaded, setHasLoaded] = useState(false);
  const [profilePosts, setProfilePosts] = useState({ results: [] });

  const currentUser = useCurrentUser();
  // Fetch data about the chosen profile to display in header
  // To know which profile to fetch, we'll need to extract the id from the URL using useParams hook
  const {id} = useParams();

  const {setProfileData, handleFollow, handleUnfollow} = useSetProfileData();
  const {pageProfile} = useProfileData();
  
  const [profile] = pageProfile.results;
  const is_owner = currentUser?.username === profile?.owner;

  useEffect(() => {
      // Destructure the data returned and rename it to page profile
      //In the array, we'll make the request to the profiles/:id endpoint
      // If everything goes well, we will need to update the pageProfile data. To access it, we'll define the setProfiledata function above
      const fetchData = async () => {
        try {
            const [{ data: pageProfile }, { data: profilePosts }] = await Promise.all([
                axiosReq.get(`/profiles/${id}/`),
                axiosReq.get(`/posts/?owner__profile=${id}`),
            ]);

            // We'll call setProfileData and spread prevState, updating the pageProfile only. After the pageProfile data has been fetched and updated in the state
            // we can hide the loader, so we'll move teh setHasLoaded inside our fetchData function.
            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {results: [pageProfile]},
            }));
            setProfilePosts(profilePosts);
            setHasLoaded(true);
        } catch(err) {
            // console.log(err);
        }
      };
      fetchData();
  }, [id, setProfileData]);

  const mainProfile = (
    <>
      {profile?.is_owner && <ProfileEditDropdown id={profile?.id} />}
      <Row noGutters className="px-3 text-center">
        <Col lg={3} className="text-lg-left">
          <Image className={styles.ProfileImage} roundedCircle src={profile?.image} />
        </Col>
        <Col lg={6}>
          <h3 className="m-2">{profile?.owner}</h3>
          <Row className="justify-content-center no-gutters">
            <Col xs={3} className="my-2">
                <div>{profile?.posts_count}</div>
                <div>posts</div>
            </Col>
            <Col xs={3} className="my-2">
                <div>{profile?.followers_count}</div>
                <div>followers</div>
            </Col>
            <Col xs={3} className="my-2">
                <div>{profile?.following_count}</div>
                <div>following</div>
            </Col>
          </Row>
        </Col>
        <Col lg={3} className="text-lg-right">
            {currentUser && 
                !is_owner && 
                (profile?.following_id ? (
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
        </Col>
        {/* Conditionally render this column to display the profile content, checking that it is defined before trying to render it */}
        { profile?.content && (<Col className="p-3">{profile.content}</Col>)}
      </Row>
    </>
  );

  const mainProfilePosts = (
    <>
      <hr />
      <p className="text-center">{profile?.owner}'s posts</p>
      <hr />
      {profilePosts.results.length ? (
        <InfiniteScroll 
            children={profilePosts.results.map((post) => (
            <Post
                key={post.id}
                {...post}
                setPosts={setProfilePosts}
            />
            ))}
            dataLength={profilePosts.results.length}
            loader={<Asset spinner />}
            hasMore={!!profilePosts.next}
            next={() => fetchMoreData(profilePosts, setProfilePosts)}
        />  
      ) : (
        <Asset src={NoResults} message={`No results found, ${profile?.owner} hasn't posted yet`} />
      )}
    </>
  );

  return (
    <Row>
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <PopularProfiles mobile />
        <Container className={appStyles.Content}>
          {hasLoaded ? (
            <>
              {mainProfile}
              {mainProfilePosts}
            </>
          ) : (
            <Asset spinner />
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        <PopularProfiles />
      </Col>
    </Row>
  );
}

export default ProfilePage;