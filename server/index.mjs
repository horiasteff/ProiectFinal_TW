import express, { json } from "express";
import sequelize from "./sequelize.mjs";
import cors from "cors";

// import { initialize } from './tabels.mjs'
import routes from "./routes.mjs";

const application = express();
application.use(cors());
application.use(json());
application.use("/api", routes);

//callback async
application.listen(8080, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error(error);
  }
});
