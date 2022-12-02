const {
  MongoClient,
  ServerApiVersion,
  MongoRuntimeError,
  ObjectId,
} = require("mongodb");

const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

require("dotenv").config();

//firebase
const serviceAccount = require("./online-resele-market-firebase-adminsdk-44wmw-ebdf02ca8e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// middlewares

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mvrzlyk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//  token middleware

async function verifyToken(req, res, next) {
  if (req.headers?.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split(" ")[1];
    try {
      const decodedUser = await admin.auth().verifyIdToken(idToken);
      req.decodedEmail = decodedUser.email;
    } catch {}
  }
  next();
}

async function run() {
  try {
    const database = client.db("computer-server");
    const allProductsCollection = database.collection("allProducts");
    const allBookingCollection = database.collection("allBooking");
    const allUsersCollection = database.collection("allUsers");
    const allPaymentCollection = database.collection("paymentDetails");
    const advertiseCollection = database.collection("advertise");

    //-------------GET AREA Start-----------------//

    //get all the products
    app.get("/allProducts", async (req, res) => {
      const query = {};
      const cursor = allProductsCollection.find(query);
      const allProducts = await cursor.toArray();
      res.send(allProducts);
    });

    // get advertise api

    app.get("/advertise", async (req, res) => {
      const query = {};
      const cursor = advertiseCollection.find(query);
      const advertise = await cursor.toArray();
      res.send(advertise);
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

    // get all user

    app.get("/allUsers", async (req, res) => {
      const query = {};
      const cursor = allUsersCollection.find(query);
      const allUsers = await cursor.toArray();
      res.send(allUsers);
    });

    //-------------Post AREA Start-----------------//

    // Post a new service

    app.post("/booking", async (req, res) => {
      const booking = req.body;
      const result = await allBookingCollection.insertOne(booking);
      res.send(result);
    });

    app.post("/addProduct", async (req, res) => {
      const product = req.body;
      const result = await allProductsCollection.insertOne(product);
      res.send(result);
    });

    // advertise post

    app.post("/advertise", async (req, res) => {
      const advertise = req.body;
      const result = await advertiseCollection.insertOne(advertise);
      res.send(result);
    });

    //paymentDetails post
    app.post("/payment", async (req, res) => {
      const payment = req.body;
      const result = await allPaymentCollection.insertOne(payment);
      res.send(result);
    });

    // post a new user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await allUsersCollection.insertOne(user);
      res.send(result);
    });

    // upsert user
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await allUsersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    // post a new user
    app.post("/advertise", async (req, res) => {
      const ads = req.body;
      const result = await advertiseCollection.insertOne(ads);
      res.send(result);
    });

    //update booking
    app.put("/booking/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const requester = req.decodedEmail;

      if (requester) {
        const requesterAccount = await allUsersCollection.findOne({
          email: requester,
        });
        if (requesterAccount.role === "buyer") {
          const filter = { _id: ObjectId(id) };
          const updateDoc = { $set: { paid: "true" } };
          const result = await allBookingCollection.updateOne(
            filter,
            updateDoc
          );
          res.json(result);
        }
      } else {
        res.status(401).json({ massage: "user not an buyer" });
      }
    });

    //update seller status
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
