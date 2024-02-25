import { rest } from "msw";

const baseURL = "https://djangorf-api-76c3c6fb6902.herokuapp.com/";

// Auto import the rest object and define a mock response for a GET request for user details, using our baseURL string, and then adding the dj-rest-auth/user/ endpoint to the end.
// The callback function will accept three arguments: request, response and context.  Inside, we'll return a json response with a user object, just like a real response from our API
// would do.  The get an actual response, open the react project and log in.  Access our api user endpoint in the browser i.e. https://djangorf-api-76c3c6fb6902.herokuapp.com/dj-rest-auth/user/
// Copy the object including curly braces and paste in below.  When our test try to reach out to this endpoint to get teh users details, our mocked api request handlers will intercept the test
// request and response with our provided data here, indicating that for my test mich is the currently logged in user
export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req,res,ctx) => {
        return res(
            ctx.json({
                "pk": 1,
                "username": "mich",
                "email": "michelle@daisy-webdesign.co.uk",
                "first_name": "",
                "last_name": "",
                "profile_id": 1,
                "profile_image": "https://res.cloudinary.com/dkxdppkpe/image/upload/v1/media/images/1f3a4ef6-8145-4c38-baef-0ec229c1ad39_ayebrb"
            })
        );
    }),

    // Logout endpoint. All we want to do is logout successfully with no errors, so, for a post request to the logout endpoint, our callback function will return a response with a 200 OK status
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req,res,ctx) => {
        return res(ctx.status(200));
    }),
];