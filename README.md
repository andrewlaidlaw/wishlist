# IBM Power Wishlist app
This is a simple application that accepts and records the wishes that our Business Partners have for the upcoming year 2025. 
They can enter their wishes in a simple form, optionally including their name if they would like some follow up. 
These are then recorded in a MongoDB document store database ready for reading through various means, including a simple 
user interface that can present all of the wishes raised.

## Deployment
This GitHub repository contains code that is intended to be deployed in a Red Hat OpenShift environment using the Source to 
Image (s2i) capability of the platform. This takes the code itself and builds a useable container image using best practices 
from Red Hat based on the programming language chosen. Using this method can also automatically create the networking services 
and routes needed to make the application available to the world.

## Components
There are three main components of this application that need to be deployed and will work together to collect wishes from
users. There are another two services that can be deployed to provide a graphical view of all of the wishes collected so far.

### MongoDB database
This is the primary data store for the application and requires persistent storage. This will be deployed using a template 
within the OpenShift cluster which also handles the generation of access credentials. We could also use an external MongoDB
instance from a Cloud provider or MongoDB themselves in their [Atlas](https://www.mongodb.com/lp/cloud/atlas/try4) service.

### Wish Backend API
This service, written in Node.js handles the interaction with the MongoDB database. It includes a single endpoint `/insert` 
which is used to insert the entire `body` element passed to it as a document in the database. It expects a JSON object.

The deployment of the Backend API requires information injected as environment variables. This includes the name of the 
MongoDB database as well as access credentiasl (created from the Secret that is generated when deploying the MongoDB database 
instance). The environment variable `DATABASE_NAME` is required, and this service will expect a collection called "wishes"
to be available in that database instance. To provide the location and credentials of the MongoDB database server, the
`MONGO_URL` environment variable can be used which encapsualtes all of that information. Alternatively, you can provide the
details in indivdual environment variables: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, and `DATABASE_PASSWORD`.

The backend code is in the `/wish-backend` folder of this repository.

### Wish User Interface
This is the webpage that users will interact with, and includes a simple form to add their wish to the database. It is built in 
React using the [IBM Carbon design system](https://carbondesignsystem.com/) to present a consistent and familiar user interface.

Only one value needs to be passed to the User interface as an environment variable, which is the URL of the Backend API as 
`REACT_APP_BACKEND_URL`.

The user interface code is in the `/wishlist` folder of this repository.

### View Backend API
This service, written in Node.js handles the interaction with the MongoDB database. It includes a single endpoint `/findall` 
which is used to read all of the enties in the "wishes" collection of the database instance and return them in a JSON array.

The deployment of the Backend API requires information injected as environment variables. This includes the name of the 
MongoDB database as well as access credentiasl (created from the Secret that is generated when deploying the MongoDB database 
instance). The environment variable `DATABASE_NAME` is required, and this service will expect a collection called "wishes"
to be available in that database instance. To provide the location and credentials of the MongoDB database server, the
`MONGO_URL` environment variable can be used which encapsualtes all of that information. Alternatively, you can provide the
details in indivdual environment variables: `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, and `DATABASE_PASSWORD`.

If these environment variables are provided in a SECRET within OpenShift, then they can be shared with the Wishes Backend API
service as well.

The backend code is in the `/view-backend` folder of this repository.

### Viewer User Interface
This is the webpage that the wish collectors will view to see all of the wishes that have so far been subitted. It is built in 
React using the [IBM Carbon design system](https://carbondesignsystem.com/) to present a consistent and familiar user interface.
Each wish is presented in a tile that includes the wish itself, along with the details of the wisher if provided and a time
and date that the wish was added.

Only one value needs to be passed to the User interface as an environment variable, which is the URL of the Backend API as 
`REACT_APP_READER_URL`.

The user interface code is in the `/viewer` folder of this repository.