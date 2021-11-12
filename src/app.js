const express = require("express");
const app = express();
const db = require("./db/database");
const dotev = require("dotenv");
require("./middleware/Redis");
const cors = require('cors')
dotev.config();




app.use(cors());
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = process.env.PORT || 3000;

 createProxyMiddleware({ 
    target: `http://localhost:${process.env.PORT}/`,
    changeOrigin: true, 
    onProxyRes: function (proxyRes, req, res) {
       proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
});



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



