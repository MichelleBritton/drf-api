import React from "react";
import { Container } from "react-bootstrap";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";

const PopularProfiles = ({ mobile }) => {
    const { popularProfiles } = useProfileData();

    return (
        // Check if the mobile prop exists and if it does, we'll add the bootstrap classes to hide the component on large screens and up
        <Container className={`${appStyles.Content} ${
            mobile && "d-lg-none text-center mb-3"
        }`}>
            {/* Check if there are any items in popularProfiles results array. If so  display the profiles, otherwise show the spinner */}
            {popularProfiles.results.length ? (
                <>
                    <p>Most followed profiles.</p>
                    {/* Check if it is mobile prop and change the layout of the profile names  */}
                    {mobile ? (
                        <div className='d-flex justify-content-around'>
                            {popularProfiles.results.slice(0,4).map((profile) => (
                                <Profile key={profile.id} profile={profile} mobile />
                            ))}
                        </div>
                    ) : (
                        popularProfiles.results.map((profile) => (
                            <Profile key={profile.id} profile={profile} />
                        ))
                    )}                    
                </>
            ) : (
                <Asset spinner />
            )}
        </Container>
    );
};

export default PopularProfiles;