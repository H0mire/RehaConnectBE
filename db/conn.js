import { MongoClient } from "mongodb";

const connectionString = process.env.URI || "mongodb://localhost:27017";

const client = new MongoClient(connectionString);

let conn;
try {
	console.log("Connecting with: "+ connectionString)
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("rehadatatables");

export default db;