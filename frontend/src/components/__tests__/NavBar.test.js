import { render, screen, fireEvent } from "@testing-library/react";
// We need this because the NavBar component renders Router Link components
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

// Create test to make sure NavBar get rendered correctly
// If you want to check out the rendered HTML, you can add screen.debug method and call it in your test. It works like console.log
test('renders NavBar', () => {
    render (
        <Router>
            <NavBar />
        </Router>
    );

    // screen.debug();

    // Assert that the sign in button is there and save it to a variable. To target it we'll use the method called getByRole and tell it we want to search for links
    // Methods that start with "get are for synchronous code. As we have 3 links in our NavBar, we'll pass it an object that says to look for the link with a name of Sign in.  This value
    // is case sensitive.
    const signInLink = screen.getByRole('link', {name: 'Sign in'});

    // Check if the signInLink is present in the document, call teh toBeInTheDocument method. To follow the red-green refactor principle we'll precede it with not to make the test fail
    //expect(signInLink).not.toBeInTheDocument()

    // Remove the not and save and it will pass
    expect(signInLink).toBeInTheDocument();
});

// Create test to check that the link to teh user profile avatar is rendered in our NavBar
// We need the callback function to be asynchronous because our test will be fetching data and we'll need to await changes in the document
// Our profile link will only show once the currentUser data is fetched, so for that we'll need to render the CurrentUserProvider as well.
// There will be a console error about a state updated on an unmounted component. The reason for that is the CurrentUserProvider is fetching currentUser details, but we'll not awaiting any UK changes in
// our test, so JEST moves on to the next test without waiting for teh request and state update to finish. As we need to target elements that arn't there on mount, because they appear as a result of async
// function, we should use on of the find query methods with teh await keyword.
test('renders link to the user profile for a logged in user', async () => {
    render (
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>            
        </Router>
    );

    // Save the profile Avatar to a variable and find it by the Profile text within the Avatar component. If we run the test again, the console errors will be gone
    // We used a different query method this time, because the profile text we are searching for isn't inside a link this time
    const profileAvatar = await screen.findByText('Profile');

    // To be super clear what we are doing here, let's make a proper assertion that the Avatar can actually be found in the document. Again we make the test fail by including not in the assertion
    //expect(profileAvatar).not.toBeInTheDocument();
    expect(profileAvatar).toBeInTheDocument();
});

// For final test, make sure that once the currently logged in user clicks the sign out link, the Sign in and Sign up links reappear
test('renders Sign in and Sign Up buttons again on log out', async () => {
    render (
        <Router>
            <CurrentUserProvider>
                <NavBar />
            </CurrentUserProvider>            
        </Router>
    );

    // Define a new variable to query our signOutLink. Similar to the profile link, the sign out link isn't present in the document on mount either so we will use a find method like last time.
    // This time we'll use the findByRole method because it's an asynchronous query
    const signOutLink = await screen.findByRole('link', {name: 'Sign out'});

    // Now, we need to simulate a user click event. The way to do this is by importing fireEvent from teh react testing library. Then inside teh test we can call the click method on fireEvent, and pass it the
    // signOutLink variable so taht our user click is fired on our chosent element
    fireEvent.click(signOutLink);

    // With the sign out link clicked, all we have to do is wait for both sign in and sign up links to be rendered in our navbar against and then check that they are in the document.
    const signInLink = await screen.findByRole('link', {name: 'Sign in'});
    const signUpLink = await screen.findByRole('link', {name: 'Sign up'});

    expect(signInLink).toBeInTheDocument();
    expect(signUpLink).toBeInTheDocument();
});