const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Meal-to-Heal API running");
});

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const foodRoutes = require("./routes/food.routes");

app.use("/api/foods", foodRoutes);


module.exports = app;