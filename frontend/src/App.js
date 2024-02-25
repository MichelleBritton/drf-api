import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import PostCreateForm from "./pages/posts/PostCreateForm";
import PostEditForm from "./pages/posts/PostEditForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import ProfileEditForm from "./pages/profiles/ProfileEditForm";
import NotFound from "./components/NotFound";

function App() {
  // Before we create the routes, we need to know who the currentUser is so we can
  // return the posts they liked, and the ones by profiles they follow
  const currentUser = useCurrentUser();
  // we need their profile_id to know whose profile_id to filter teh posts by. In case
  // the current user's details are still being fetched in the background, it will default to
  // an empty string.
  const profile_id = currentUser?.profile_id || "";

  return (
        // The styles object here relates to the name we gave our import at the top and the .App 
        // relates to the .APP class we set in our css File. Now all the properties we created for 
        // the .App class name will be applied to this element
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            {/* The Switch holds all our Routes, and renders a given component when a Route path
            matches the current URL. The render prop on our Route component accepts a function
            that returns a component to be rendered when teh Route path is matched.  The path
            prop is the browser url the user will be at when they see teh component in our render prop.
            The exact prop tells the route to only render its component when teh url entered is exactly
            the same. */}
            <Switch>
              <Route 
                exact 
                path="/" 
                render={() => (
                  <PostsPage message="No results found. Adjust the search keyword." />
                )}
              />
              <Route 
                exact 
                path="/feed" 
                render={() => (
                  <PostsPage 
                    message="No results found. Adjust the search keyword or follow a user."
                    filter={`owner__followed__owner__profile=${profile_id}&`} 
                  />
                )} 
              />
              <Route 
                exact 
                path="/liked" 
                render={() => (
                  <PostsPage 
                    message="No results found. Adjust the search keyword or like a post."
                    filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
                  />
                )}
              />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="/posts/create" render={() => <PostCreateForm />} />
              <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
              
              {/* The : means that id is a parameter that can be passed through the url */}
              <Route exact path="/posts/:id" render={() => <PostPage />} />
              <Route exact path="/profiles/:id" render ={() => <ProfilePage />} />
              <Route
                exact
                path="/profiles/:id/edit/username"
                render={() => <UsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <UserPasswordForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route render={()=> <NotFound />} />
            </Switch>
          </Container>
        </div>
  );
}

export default App;