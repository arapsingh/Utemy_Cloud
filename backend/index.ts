import express, { Application } from "express";
import configs from "./src/configs";
import cors from "cors";
import routes from "./src/routes";
// import { text } from "stream/consumers";

const app: Application = express();
const port: number = configs.general.PORT;

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); //

app.use("/api/auth", routes.authRouter);
app.use("/api/lesson", routes.lessonRouter);
app.use("/api/user", routes.userRouter);
app.use("/api/category", routes.categoryRouter);
app.use("/api/course", routes.courseRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
