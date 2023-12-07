import express, { Application } from "express";
import configs from "./src/configs";
import cors from "cors";
import routes from "./src/routes";

const app: Application = express();
const port: number = configs.general.PORT;

// Chỉ định cấu hình CORS
const corsOptions = {
    origin: "http://localhost:3000", // Chỉ cho phép yêu cầu từ trang web này
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Các phương thức được phép
    credentials: true, // Cho phép sử dụng cookie hoặc header xác thực
    optionsSuccessStatus: 204, // Mã trạng thái cho các yêu cầu OPTIONS thành công
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/auth", routes.authRouter);
app.use("/api/user", routes.userRouter);
app.use("/api/section", routes.sectionRouter);
app.use("/api/course", routes.courseRouter);
app.use("/api/lesson", routes.lessonRouter);
app.use("/api/category", routes.categoryRouter);
app.use("/api/feedback", routes.feedbackRouter);
app.use("/api/rating", routes.ratingRouter);
app.use("/api/cart", routes.cartRouter);
app.use("/api/invoice", routes.invoiceRouter);
app.use("/api/stat", routes.statRouter);
app.use("/IPN", routes.vnpayRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
