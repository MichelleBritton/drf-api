import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import { followHelper, unfollowHelper } from "../utils/utils";


const ProfileDataContext = createContext();
const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);

export const ProfileDataProvider = ({ children }) => {
    const [profileData, setProfileData] = useState({
        // we will use the pageProfile later
        pageProfile: { results: [] },
        // set the popularProfiles to an object with an empty results array inside
        popularProfiles: { results: [] },
    });

    // When do we run useEffect?  Every user has to make different requests to follow and unfollow people, so we'll need to re-fetch popularProfiles depending on the state of the current user
    // we can then add it to the useEffect's dependency array
    const currentUser = useCurrentUser();

    const handleFollow = async (clickedProfile) => {
        try {
            // destructure the data property from the response object
            const {data} = await axiosRes.post('/followers/', {
                // The data we'll send is information about what profile the user just followed, which is the id of the profile the user just clicked
                followed: clickedProfile.id
            });

            setProfileData((prevState) => ({
                ...prevState,
                pageProfile: {
                    results: prevState.pageProfile.results.map((profile) => 
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
                popularProfiles: {
                    ...prevState.popularProfiles,
                    results: prevState.popularProfiles.results.map((profile) => 
                        followHelper(profile, clickedProfile, data.id)
                    ),
                },
            }));
        } catch(err) {
            // console.log(err);
        }
    };

    const handleUnfollow = async (clickedProfile) => {
        try {
          await axiosRes.delete(`/followers/${clickedProfile.following_id}/`);
          setProfileData((prevState) => ({
            ...prevState,
            pageProfile: {
              results: prevState.pageProfile.results.map((profile) =>
                unfollowHelper(profile, clickedProfile)
              ),
            },
            popularProfiles: {
              ...prevState.popularProfiles,
              results: prevState.popularProfiles.results.map((profile) =>
                unfollowHelper(profile, clickedProfile)
              ),
            },
          }));
        } catch (err) {
          // console.log(err);
        }
      };

    // Next we need to fetch our popularProfiles data on mount
    useEffect(() => {
        const handleMount = async () => {
            try {
                // Make a request with the axiosReq instance to the profiles endpoint and getch them in descending order of how many followers they have so the most followed profile will be at the top
                const {data} = await axiosReq.get('/profiles/?ordering=-followers_count');

                // If everything goes well, we'll call the setProfileData function
                // Inside, we'll spread the previous state, which will eventually include the pageProfile data as well as our popularProfiles
                // Then, we can update only the popular profiles with the data returned from the API request
                setProfileData(prevState => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            } catch(err) {
                // console.log(err)
            }
        };

        handleMount();
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            {/* We have to expose the handleFollow function in the provider so that the profile components have access to it when the follow button is clicked. As we are sending two functions, we'll need
            to send them as an object so we need to add an extra pair of curly braces and then add in our handleFollow function. Now that we are sending multiple functions within an object rather than a single
            function, we'll have to destructure setProfileData in ProfilePage.js where we called our useSetProfileData hook */}
          <SetProfileDataContext.Provider value={{setProfileData, handleFollow, handleUnfollow}}>
            {children}
          </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
      );
    };