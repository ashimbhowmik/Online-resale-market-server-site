const {
  MongoClient,
  ServerApiVersion,
  MongoRuntimeError,
  ObjectId,
} = require("mongodb");

// const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

// //firebase
// const serviceAccount = require("./sports-capturing-firebase-admin.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fbybecg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//  token middleware

// async function verifyToken(req, res, next) {
//   if (req.headers?.authorization?.startsWith("Bearer ")) {
//     const idToken = req.headers.authorization.split(" ")[1];
//     try {
//       const decodedUser = await admin.auth().verifyIdToken(idToken);
//       req.decodedEmail = decodedUser.email;
//     } catch {}
//   }
//   next();
// }

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.listen(port, () => {
  console.log(`listen ${port}`);
});
