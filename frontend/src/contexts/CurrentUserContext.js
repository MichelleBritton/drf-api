import { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { useHistory } from "react-router";
import { removeTokenTimestamp, shouldRefreshToken } from "../utils/utils";

// As different pieces of UI will be displayed based on whether the user browing our site is logged in or not, this means that
// user state and data will be used all over the application. It would be a real pain to have to pass both the currentUser variable
// and its setter function manually as props down teh Component TreeWalker. In order to make it more toHaveAccessibleDescription, we'll use 
// the useContext hook. The React documentation states that context provides a convenient way to pass data required by many Components in an APP. 
// Essentially, context is designed to share data that can be considered global to any child components that need access to it.
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// In order to make accessing currentUser and setCurrentUser less cumbersome, by not having to import the useContext alongside Context objects,
// we'll create two custom hooks
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

export const CurrentUserProvider = ({ children }) => {
    // Create useState hook and destructure the returned values as currentUser and setCurrentUser
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

    // We make a network request to check who the user isFinite, based on their credentials in the cookie
    // To do that we have to make a GET request to the dj-rest-auth/user/ endpoint of our API which we should do 
    // when the component mounts
    // Inside a try/catch block we'll make a GET request to the user endpoint. We'll destructure the data property
    // in place and we'll set the currentUser to data, by calling setCurrentUser with it
    // Uses the response interceptor
    const handleMount = async () => {
        try {
          const { data } = await axiosRes.get("dj-rest-auth/user/");
          setCurrentUser(data);
        } catch (err) {
        //   console.log(err);
        }
      };

    // To have code run when a component mounts, we have to make use of the useEffect hook and pass it an empty dependency Array.
    // Now we can call teh handleMount function inside
    useEffect(() => {
        handleMount();
    }, []);

    // useMemo hook is usually used to cache complex values that take time to compute. we are using it here because it runs
    // before the children components are mounted and we want to attach teh intercepts before teh children mount as that's
    // where we'll be using them and making the requests from

    // Inside the useMemo hook, start by creating the response interceptor.  Attach it to the axiosRes instance created in axiosDefaults
    // If there's no error, just return the response. If there is an error, check if it's status is 401 unauthorised, then inside a try/catch
    // block attempt to refresh the token. If that fails, redirect teh user to the signin page. To do that, define teh history variables first. Back in 
    // the catch block, if the user is logged in redirect them to signin and set their data to null, if there's no error refreshing the token, return an 
    // axios instance with the error config to exit the interceptor. In case teh error wasn't 401, just reject teh Promise with teh error to exit the interceptor. 
    useMemo(() => {
        axiosReq.interceptors.request.use(
            async (config) => {
                // The if block will run only if the token should be refreshed
                if (shouldRefreshToken()){
                    try {
                        // Try to refresh the token before sending the request
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch(err){
                        // In case that fails, and the user was previously logged in it means that the refresh token has expired
                        // so redirect them to the signin page and set currentUser to null
                        setCurrentUser((prevCurrentUser)=> {
                            if (prevCurrentUser) {
                                history.push('/signin');
                            }
                            return null;
                        });
                        removeTokenTimestamp();
                        return config;
                    }
                }                
                return config;
            },
            (err) => {
                return Promise.reject(err);
            }
        );

        axiosRes.interceptors.response.use(
            (response) => response,
            async (err) => {
                if (err.response?.status === 401){
                    try{
                        await axios.post('/dj-rest-auth/token/refresh/');
                    } catch(err){
                        setCurrentUser(prevCurrentUser => {
                            if (prevCurrentUser){
                                history.push('/signin');
                            }
                            return null;
                        });
                        removeTokenTimestamp();
                    }
                    return axios(err.config);
                }
                return Promise.reject(err);
            }
        )
    // Add a dependency array for our useMemo hook with history inside.  We want useMemo to only run once, but the linter will
    // throw a warning if we provided an empty array
    }, [history]);

    return (
        // Every context object comes with a provider Component that allows child components to subscribe to the context changes. 
        // A provider accepts a value prop to be passed to child components that need to consume that value. In our case, the values 
        // being passed will be the currentUser and setCurrentUser, which is the function to update teh currentUser value.
        <CurrentUserContext.Provider value={currentUser}>
            <SetCurrentUserContext.Provider value={setCurrentUser}>
                {children}
            </SetCurrentUserContext.Provider>
        </CurrentUserContext.Provider>
    )
}