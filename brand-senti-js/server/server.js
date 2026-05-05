const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const sentimentRoute = require("./routes/sentiment");
const dashboardRoute = require("./routes/dashboard");
const apiRoute = require("./routes/api");

app.use("/api/sentiment", sentimentRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api", apiRoute);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("BrandSentiment API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
