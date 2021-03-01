const indexRoter= require("./index");
const usersRoter= require("./users");
const toysRoter= require("./toys");


exports.corsAccessControl = (app) => {
 app.all('*', function (req, res, next) {
   if (!req.get('Origin')) return next();
   res.set('Access-Control-Allow-Origin', '*');
   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
   res.set('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,auth-token');
   next();
 });
}


exports.routesInit = (app) => {
 app.use("/", indexRoter);
 app.use("/users", usersRoter);
 app.use("/toys", toysRoter);


 

 app.use((req,res) => {
   res.status(404).json({msg:"404 page not found"})
 })
}
