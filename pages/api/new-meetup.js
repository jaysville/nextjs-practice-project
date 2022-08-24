import { MongoClient } from "mongodb";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body;

    const url = process.env.NEXT_PUBLIC_DB_URL;

    const client = new MongoClient(url);

    const dbName = "react-meetups";

    await client.connect();

    console.log("server connection established!");

    const db = client.db(dbName);
    const collection = db.collection("meetups");

    const insertedResult = await collection.insertOne(data);
    console.log(insertedResult);

    res.status(201).json({ message: "Meetup Inserted" });
  }
};

export default handler;
