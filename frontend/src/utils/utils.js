// This can be reused with any paginated data like comments or profiles.
// A function to pass our next prop for infinite scrolling
// Export an async function which will accept two arguments: resource and setResource so that we can

import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults"

// render and update different types of data for our infinite scroll component
export const fetchMoreData = async (resource, setResource) => {
    try {
        // Make a network request to resource.next which is a url to the next page of results 
        // If there's no error, we'll call setResource and pass it a callback function with 
        // prevResource as the argument. The callback function will return an Object, inside of which
        // we'll spread prevResource. Well update the next attribute with the url to the next page of results as well
        const {data} = await axiosReq.get(resource.next)
        setResource(prevResource => ({
            ...prevResource,
            next:data.next, 
            // Use teh reduce method to add our new posts to the prevResource.results array
            results: data.results.reduce((acc, cur) => {
                // Use the some method to check whether the callback passed to it returns true for at least one element 
                // in the array adn it stops running as soon as it does. So we can use it to check if any of our post ids 
                // in the newly fetched data matches an id that already exists in our previous results. If teh some method 
                // finds a matchMedia, we'll just return the existing accumulator to the reduce method but if it doesn't find a 
                // match we know this is a new post, so we can return our spread accumulator with the new post at the end

                // A review of what's going on here: 
                // We used the reduce method to loop through the new page of results that we got from our API.
                // We then appended our new results to the existing posts in our posts.results array in the state.
                // Then we used teh some() method to leep through the array of posts in the accumulator.
                // Inside, we compared each accumulator item id to the current post id from teh new fetched posts array.
                // If the some() method returned true, this means it found a match and we are displaying that post already.
                // So in this case we return the accumulator without adding the post to it and if the some() method does not find a match, we return an array containing our 
                // spread accumulator with teh new post added to it
                return acc.some(accResult => accResult.id === cur.id) 
                    ? acc 
                    : [...acc, cur];
            }, prevResource.results)
        }));
    } catch(err) {}
};

export const followHelper = (profile, clickedProfile, following_id) => {
    return profile.id === clickedProfile.id
    ?   // This is the profile I clicked on, update its followers count and set its following id
        // Check if the profile in the array we're iterating over is the same one the user just clicked on. If their id's are the same, we'll return the profile object, increasting its followers_count by 1 and setting
        // it's following_id to data.id
        {
            ...profile,
            followers_count: profile.followers_count + 1,
            following_id,
        }
    : profile.is_owner
    ?   // This is the profile of the logged in user. update its following count
        // We'll check if hte profile in the array we're iterating over is owned by the currently logged in user. If so, we'll have to increase that profile's following_count by 1, because the currently logged in user
        // just followed a profile.
        { ...profile, following_count: profile.following_count + 1}
    :   // This is not the profile the user clicked on or the profile the user owns, so just return it unchanged
        profile;                    
};

export const unfollowHelper = (profile, clickedProfile) => {
    return profile.id === clickedProfile.id
    ?   {
            ...profile,
            followers_count: profile.followers_count - 1,
            following_id: null,
        }
    : profile.is_owner
    ?   { ...profile, following_count: profile.following_count - 1}
    :   profile;                    
};

// Token refresh fix

// Set a token timestamp in the browser storage
// Export and define a function call setTokenTimestamp. It will accept the data object returned by teh API on login. Then, we'll auto import and use teh jwtDecode function, to decode the refresh token. This object comes with 
// an expiry date with a key of exp so we can save teh exp attribute to a variabled called refreshTokenTimestamp.  Finally we can save that value to the user's browser using localStorage, and set its key to refreshTokenTimestamp
export const setTokenTimestamp = (data) => {
    const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

// Create a function that will return a boolean value that will tell us if we should refresh the users token or not
// Export and name is shouldRefreshToken and it will return the refreshTokenTimestamp value from our local storage, converted by the double not logical operator.  This means that the token will be refereshed only for a logged in user
export const shouldRefreshToken = () => {
    return !!localStorage.getItem("refreshTokenTimestamp");
};

// Finally, write a third function to remove the localStorage value if the user logs out or their refresh token has expired. So, export it and name it removeTokenTimestamp.  All it will do is remove the refreshTokenTimestamp from the localStorage
export const removeTokenTimestamp = () => {
    localStorage.removeItem("refreshTokenTimestamp");
};