import "dotenv/config";
import express from "express";
import v1Routes from "./routes/index.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use("/api/v1", v1Routes);

const main = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`API is runing in the port: ${PORT}`);
    });
  } catch (error) {
    console.error(`Start API error: ${error}`);
  }
};

main();
