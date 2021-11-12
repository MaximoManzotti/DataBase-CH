const User = require("../models/Users");
const client = require("./Redis");

module.exports = async (req, res, next) => {
  try {
    client.get("id", async (err, data) => {
 let usuario = await User.findOne({ where: { id: data } }
        );

console.log(data)
      if (!usuario.businessman){
            res.status(401).send("This section is for businessman")
      } else if(err){
          console.log(err)
     }else if(data){
next();
}      
    });
  } catch (error) {
    res.status(400).send("Error validating the user" + error);
  }
};
