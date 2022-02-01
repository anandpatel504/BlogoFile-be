var express = require("express");
var router = express.Router();
const UserService = require("../services/users");
const Services = new UserService();

const { generateAccessToken } = require("../auth/strategies/jwt");

// landing page
router.get("/", (req, res) => {
  res.send({ success: "Welcome on the home page!" });
});

// /db route
router.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM test_table");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// create users account
router.post("/signup", async (req, res) => {
  await Services.createUsers(req.body)
    .then((data) => {
      const userInfo = Services.emailChecking(req.body.email);
      const token = generateAccessToken(userInfo);
      res.send({
        "status": "success",
        "token": token,
        name: userInfo.name
      });
    })
    .catch((err) => {
      res.send({
        "status": "error",
        "message": "This user alerady exists."
      })
    });
});

// login user with JWT
router.post("/login", async (req, res, next) => {
  const userInfo = await Services.emailChecking(req.body.email);
  console.log(userInfo);
  if (userInfo) {
    const passCheck = await Services.PassChecking(userInfo, req.body.password);
    if (passCheck) {
      const token = generateAccessToken(userInfo);
      res.cookie("key", token);
      res.send({status: 'success', token: token, name: userInfo.name });
    } else {
      res.send({status: 'error', message: "wrong password! 🤔" });
    }
  } else {
    res.send({status: "error", message: "This @email isn't exist! 😅" });
  }
});

// get all users
router.get("/users", async (req, res) => {
  const allUsers = await Services.findAll();
  res.send(allUsers);
});

// get user by id
router.get("/user/:id", async (req, res) => {
  const userId = req.params.id;
  await Services.findById(userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});
module.exports = router;
