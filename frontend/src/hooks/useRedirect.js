import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router";

// Export and define a hook which will accept an argument called userAuthStatus which will be a string set to either logged in or logged out depending on which  type of user we want to redirect.
export const useRedirect = (userAuthStatus) => {
    // we are going to redirect users back to the home page so we'll use useHistory hook to save the history object into a variable
    const history = useHistory();

    // to tell whether or not a user is logged in, we'll need to make a network request on mount
    // We don't need our axios interceptors here before this endpoint will let us know if the user is authenticated or not. The post request will act like a check as to whether the user is current logged in or not
    // If the user is logged in the access tocken will be refreshed successfully and any code left in the try block will be able to run. If they are not logged in, we'll get a response with the 401 error, and then the code in our
    // catch block will run.
    useEffect(() => {
        const handleMount = async () => {
          try {
            await axios.post("/dj-rest-auth/token/refresh/");
            // if user is logged in, the code below will run
            if (userAuthStatus === "loggedIn") {
              history.push("/");
            }
          } catch (err) {
            // if user is not logged in, the code below will run
            if (userAuthStatus === "loggedOut") {
              history.push("/");
            }
          }
        };
    
        handleMount();
      }, [history, userAuthStatus]);
    };