const express = require("express");
const cors = require("cors");
const transcribeRouter = require("./routes/transcribe");

const app = express();
const port = 5001;

app.use(cors());
app.use("/transcribe", transcribeRouter);

app.get("/", (req, res) => res.send("Server is running!"));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
