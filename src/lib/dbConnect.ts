import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<unknown> {
  if (connection?.isConnected) {
    console.log("already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI as string, {});
    console.log('database: ', db)

    connection.isConnected = db.connections[0].readyState
    console.log('DB Connected Successfully')

  } catch (error) {


    console.log('DB Connection Failed')
    console.log('DB Connecion Error: ', error)
    process.exit(1)
  }
}

export default dbConnect
