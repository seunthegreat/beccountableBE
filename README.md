# Beccountable-Backend

## Folder Structure `(src/)`

`config/`
This folder contains configuration files for the application, including database configuration and environment variables.

`controllers/`
This folder contains the controllers that handle the HTTP requests made to the server.

`models/`
This folder contains the models that represent the data stored in the database.

`routes/`
This folder contains the route handlers that map the HTTP requests to the appropriate controller functions.

`views/`
This folder contains the HTML templates that are rendered by the server and served to the client.

`public/`
This folder contains the static assets (CSS, JavaScript, images) that are served to the client.

`tests/`
This folder contains the tests for the application.

`app.js`
This is the main entry point for the application, where the server is started and the routes are defined.

`package.json`
This file contains the dependencies for the application, as well as scripts for starting the server and running tests.

## How to Run the Application
- Clone the repository
- Install the dependencies by running npm install
- Start the server by running npm start
- Access the application in your browser at http://localhost:3000

## How to Run the Tests
- Install the dev dependencies by running npm install --dev
- Run the tests by running npm test

## Environment Variables

The application uses the following environment variables:

- PORT: The port on which the server should listen (default: 3000)
- MONGODB_URI: The URI for the MongoDB database (default: mongodb://localhost/beccountable)
- SESSION_SECRET: The secret key used to sign the session cookie (default: mysecretkey)
