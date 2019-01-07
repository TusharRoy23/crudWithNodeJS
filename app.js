const vertex = require("vertex360")({ site_id: process.env.TURBO_APP_ID });

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const expressValidator = require("express-validator");
const flash = require("express-flash-messages");
const multer = require("multer");
//const expressFormidable = require("express-formidable");

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(
  session({ secret: "tusharRoy", saveUninitialized: false, resave: false })
);
app.use(flash());

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
    var type = file.mimetype;
    var typeArray = type.split("/");

    if (typeArray[0] == "image" && file.fieldname == "photo") {
      callback(null, "./public/uploads/");
    } else if (typeArray[0] == "application" && file.fieldname == "picture") {
      callback(null, "./public/files/");
    }
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + "-" + file.originalname);
  }
});

app.use(
  multer({
    storage: storage,
    fileFilter: function(req, file, callback) {
      var type = file.mimetype;
      var typeArray = type.split("/");

      if (typeArray[0] == "image" && file.fieldname == "photo") {
        callback(null, true);
      } else if (typeArray[0] == "application" && file.fieldname == "picture") {
        callback(null, true);
      } else {
        req.flash.imageFile = "Only jpg/jpeg/png/gif are allowed";
        callback(null, false);
      }
    }
  }).fields([
    {
      name: "photo"
    },
    { name: "picture" }
  ])
);

// import routes
const index = require("./routes/index");
const api = require("./routes/api");

// set routes
app.use("/", index);
app.use("/api", api); // sample API Routes

module.exports = app;
