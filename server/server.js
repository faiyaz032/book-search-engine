//dependencies
const express = require('express');
require('dotenv').config();
const path = require('path');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const cors = require('cors');
//internal imports
const { typeDefs, resolvers } = require('./schemas');
const { authMiddleware } = require('./utils/auth');

// const routes = require('./routes');

//express server
const app = express();
const PORT = process.env.PORT || 3001;

//enable cors
app.use(
   cors({
      origin: true,
   })
);

//apollo server
const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: authMiddleware,
});

server.applyMiddleware({ app });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
   app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get('*', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

//Connect to database and start the app
mongoose
   .connect(process.env.MONGODB_URI || 'mongodb://localhost/book-search-engine', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
   })
   .then(() => {
      app.listen(PORT, () => console.log(`App is successfully connected to the database`));
      console.log(`GraphQL is live at http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`App is alive on PORT:${PORT}`);
   })
   .catch((error) => {
      console.log(error);
   });
