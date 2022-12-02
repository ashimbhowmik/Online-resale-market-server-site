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

async function run() {
  try {
    const database = client.db("bi-cycle-server");
    const allProductsCollection = database.collection("allProducts");
    const allBookingCollection = database.collection("allBooking");
    const allUsersCollection = database.collection("allUsers");
    const allPaymentCollection = database.collection("paymentDetails");

    //-------------GET AREA Start-----------------//

    //get all the products
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const cursor = allProductsCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    //get all the booking
    app.get("/booking", async (req, res) => {
      const query = {};
      const cursor = allBookingCollection.find(query);
      const allBooking = await cursor.toArray();
      res.send(allBooking);
    });
    //get all users
    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = allUsersCollection.find(query);
      const allUsers = await cursor.toArray();
      res.send(allUsers);
    });

    // get a specific user
    app.get("/allUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { email: id };
      const user = await allUsersCollection.findOne(query);
      res.json(user);
    });

    //-------------Post AREA Start-----------------//

    // Post a new service

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await allBookingCollection.insertOne(booking);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome to Server");
});

app.listen(port, () => {
  console.log(`listen ${port}`);
});
