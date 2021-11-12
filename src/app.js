const express = require("express");
const app = express();
const db = require("./db/database");
const dotev = require("dotenv");
require("./middleware/Redis");
dotev.config();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.listen(PORT, () => {
  console.log(`Server start on ${PORT}`);
});

async () => {
  db.authenticate()
    .then(() => {
      console.log("Database conectada");
    })
    .catch((error) => {
      console.log(error);
    });

  await db.sync({ force: true || false });
};


const UserRoutes = require("./routes/users");
app.use("/users", UserRoutes);


const PropousalsRoustes = require("./routes/Propousals");
app.use("/propousals", PropousalsRoustes);

const Comments = require("./routes/comments");
app.use("/comments", Comments);



