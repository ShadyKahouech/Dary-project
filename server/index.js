const express = require("express");
const CORS = require("cors");
const userRoute = require("./router/userRouter");
const helmet = require("helmet");

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(CORS());
app.use(helmet());

app.use(
  helmet({
    contentSecurityPolicy: true,
  })
);

app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.send("hello from the server!");
});
app.listen(PORT, () => {
  console.log(`server is lestening at http://localhost:${PORT}`);
});
