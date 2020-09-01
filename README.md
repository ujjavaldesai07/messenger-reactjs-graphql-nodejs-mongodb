# messenger-reactjs-graphql-nodejs-mongodb
Messenger is a chat application built using ReactJS, NodeJS, GraphQL, Websocket and MongoDB.

**DEMO**
- Deployed to Heroku Cloud:

  https://messenger-2.herokuapp.com

  **Note:** It is running on a free dyno, so the services will go to sleep if not in use.
            For the first time, it may take some time to respond. As this app is running
            on free dyno a cleanup script will run every 15 minutes 
            to remove all the documents from MongoDB.
 
**FEATURES**

- Chat application with a dark theme.
- Notifications will be received for new friend requests.
- Snackbars for the welcome message and to notify user about friend request activity.

**TOOLS USED**

- **ReactJS:** Front-end Javascript framework.
- **NodeJS:** Back-end framework to serve client request
- **GraphQL-Yoga:** A quick and easier server setup for fetching data 
    and allows creating communication channel using websocket technology called GraphQL Subscription.
- **Material-UI:** Used Google's material design based on the CSS Framework for a responsive website.
- **MongoDB:** Stores user account and chat information.
- **Heroku Cloud Platform:** Deploying microservices on Heroku.

**Steps for executing the application using docker-compose:**
1. Clone/Download the repository.

2. Set the environmental variables.

   **MONGODB_URI**: For setting the MongoDB URL. 

   **REACT_APP_SERVER_URL**: For setting back-end NodeJS server URL.
   
3. Run the below command in react-ui and server directory to download all
   the dependencies.
   
   ```
      yarn install
   ```
   
4. Run the below command in server directory to start the NodeJS server.

   ```
      npm start
         OR
      nodemon ./server.js
   ```
   
5. Run the below command to start client side React-UI service.

   To run in Dev environment.
   ```
      npm dev_start
           OR
      react-scripts start
   ```
   
   To run in Production environment/Heroku platform.
   ```
      npm start
            OR
      node server.js
   ```

**HOW TO TEST THIS APPLICATION?** 

1) Create two users in two different browsers for eg Safari and Google Chrome.
2) Find the name of user by clicking "Find Friend Online" button from the sidebar.
3) Send and Accept the request. 
4) Click on the chat icon tab and select the friend name.
5) Finally the application will let you to communicate with each other.

  **Note:** Messages are stored as raw/unencrypted format.

**References**  
1. https://www.apollographql.com/docs/react/
2. https://docs.mongodb.com/manual/introduction/
3. https://mongoosejs.com/docs/index.html
4. https://iamhosseindhv.com/notistack
5. https://material-ui.com/getting-started/installation/
6. https://hub.docker.com/_/mongo
7. https://github.com/js-cookie/js-cookie
8. https://reactjs.org/docs/hooks-reference.html
