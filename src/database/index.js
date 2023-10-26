import mongoose, { connection } from "mongoose";

const configOptions = {
  useNewURLParser: "true",
  useUnifiedTopology: "true",
};

const connectToDB = async () => {
  const connectionURL = process.env.MONGODB_URL;

  mongoose
    .connect(connectionURL, configOptions)
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.log("Error:", err));
};

export default connectToDB;
