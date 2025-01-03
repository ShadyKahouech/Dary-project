const express = require("express");
const CORS = require("cors");
const userRoute = require("./router/userRouter");

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(CORS());

app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.send("hello from the server!");
});
app.listen(PORT, () => {
  console.log(`server is lestening at http://localhost${PORT}`);
});
