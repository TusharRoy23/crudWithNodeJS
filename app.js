const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const flash = require("express-flash-messages");

//const app = vertex.express() // initialize app

const config = {
  views: "views", // Set views directory
  static: "public", // Set static assets directory
  db: {
    // Database configuration. Remember to set env variables in .env file: MONGODB_URI, PROD_MONGODB_URI
    url:
      process.env.TURBO_ENV == "dev"
        ? process.env.MONGODB_URI
        : process.env.PROD_MONGODB_URI,
    type: "mongo",
    onError: err => {
      console.log("DB Connection Failed!");
    },
    onSuccess: () => {
      console.log("DB Successfully Connected!");
    }
  }
};

const app = vertex.app(config); // initialize app with config options

//Validation and Cookie Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({ secret: "tusharRoy", saveUninitialized: false, resave: false })
);
app.use(flash());

// import routes
const index = require("./routes/index");
const api = require("./routes/api");

// set routes
app.use("/", index);
app.use("/api", api); // sample API Routes

module.exports = app;
