# IBM Power Wishlist app
This is a simple application that accepts and records the wishes that our Business Partners have for the upcoming year 2025. 
They can enter their wishes in a simple form, optionally including their name if they would like some follow up. 
These are then recorded in a MongoDB document store database ready for reading through other means.

## Deployment
This GitHub repository contains code that is intended to be deployed in a Red Hat OpenShift environment using the Source to 
Image (s2i) capability of the platform. This takes the code itself and builds a useable container image using best practices 
from Red Hat based on the programming language chosen. Using this method can also automatically create the networking services 
and routes needed to make the application available to the world.

## Components
There are three main components of this application that need to be deployed and will work together.

### MongoDB database
This is the primary data store for the application and requires persistent storage. This will be deployed using a template 
within the OpenShift cluster which also handles the generation of access credentials.

### Backend API
This service, written in Node.js handles the interaction with the MongoDB database. It includes a single endpoint `/insert` 
which is used to insert the entire `body` element passed to it as a document in the database. It expects a JSON object.

The deployment of the Backend API requires information injected as environment variables. This includes the name of the 
MongoDB database as well as access credentiasl (created from the Secret that is generated when deploying the MongoDB database 
instance). These environment variables are `DATABASE_NAME` and `MONGO_URL` respectively.

The backend code is in the `/wish-backend` folder of this repository.

### User Interface
This is the webpage that users will interact with, and includes a simple form to add their wish to the database. It is built in 
React using the [IBM Carbon design system](https://carbondesignsystem.com/) to present a consistent and familiar user interface.

Only one value needs to be passed to the User interface as an environment variable, which is the URL of the Backend API as 
`REACT_APP_BACKEND_URL`.

The user interface code is in the `/wishlist` folder of this repository.
