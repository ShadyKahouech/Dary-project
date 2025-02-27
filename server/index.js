const express = require("express");
const CORS = require("cors");
const userRoute = require("./router/userRouter");
const prestataireRoute = require("./router/prestataireRoute");
const helmet = require("helmet");
const passport = require("passport");
const googleRoute = require("./router/googleRoute");

const PORT = 3000;
const app = express();
app.use(express.json());
app.use(CORS());

app.use(helmet());

// Initialize passport
app.use(passport.initialize());
app.use("/google", googleRoute);

app.use(
  helmet({
    contentSecurityPolicy: true,
    crossOriginResourcePolicy: { policy: "same-origin" },
    xFrameOptions: { action: "deny" },
  })
);

app.use("/user", userRoute);
app.use("/prestataire", prestataireRoute);
app.get("/", (req, res) => {
  res.send("hello from the server!");
});
app.listen(PORT, () => {
  console.log(`server is lestening at http://localhost:${PORT}`);
});
