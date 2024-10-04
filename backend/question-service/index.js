import express from "express";
import cors from "cors";

import questionRoutes from "./routes/question-routes.js";

const app = new express();

app.use(express.urlencoded({ extended: true })); // for parsing application with querystring
app.use(express.json()); // for parsing application/json

app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

// To handle CORS Errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // "*" -> Allow all links to access
  
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
  
    // Browsers usually send this before PUT or POST Requests
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH");
      return res.status(200).json({});
    }
  
    // Continue Route Processing
    next();
  });

 app.use("/question", questionRoutes);

 app.get("/", (req, res) => {
     console.log("Sending Greetings from Question Service!");
     res.send("Greetings from Question Service!");
 });

 app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });
  
  export default app;