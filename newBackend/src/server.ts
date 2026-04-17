// src/app.ts หรือ src/index.ts
import { UserRouter } from "./generated/User/UserRouter";


const express = require('express');
const app = express();
const port = 3000;



app.use('/api/users', UserRouter)


// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
