var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserService = require("../services/user");
const Services = new UserService();

const { generateAccessToken } = require("../auth/strategies/jwt");

// landing page
router.get("/", (req, res) => {
  res.send({ success: "Welcome on the home page!" });
});

// create users account
router.post("/signup", async (req, res) => {
  await Services.createUsers(req.body)
    .then((data) => {
      console.log(data, "data");
      const userInfo = Services.emailChecking(req.body.email);
      const token = generateAccessToken(userInfo);
      res.send({
        status: "success",
        token: token,
        name: userInfo.name,
      });
    })
    .catch((err) => {
      res.send({
        status: "error",
        message: "This user alerady exists.",
      });
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
      res.send({ status: "success", token: token, name: userInfo.name });
    } else {
      res.send({ status: "error", message: "wrong password! 🤔" });
    }
  } else {
    res.send({ status: "error", message: "This @email isn't exist! 😅" });
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
  console.log(userId, "userID");
  await Services.findById(userId)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.send(err);
    });
});

// forgot-password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    // look for email in database
    const [user] = await Services.filterBy({ email });
    console.log(user, "user hai");
    // if there is no user send back an error
    if (!user) {
      res.status(404).json({ error: "Invalid email" });
    } else {
      // otherwise we need to create a temporary token that expires in 10 mins
      const resetLink = jwt.sign({ user: user.email }, process.env.SECRET_KEY, {
        expiresIn: "10m",
      });
      // update resetLink property to be the temporary token and then send email
      // await Services.update(user.id, { resetLink });
      await Services.sendEmail(user, resetLink);
      res.status(200).json({status: 'success', message: "Check your email", user: user });
    }
  } catch (error) {
    res.status(500).json({status: 'error', message: error.message });
  }
});

// reset-password by the user token
router.patch("/reset-password/:token", async (req, res) => {
  // Get the token from params
  const resetLink = req.params.token;
  const newPassword = req.body;

  // if there is a token we need to decoded and check for no errors
  if (resetLink) {
    jwt.verify(resetLink, process.env.SECRET_KEY, (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: "Incorrect token or expired" });
      }
    });
  }

  try {
    // find user by the temporary token we stored earlier
    const [user] = await Services.filterBy({ resetLink });

    // if there is no user, send back an error
    if (!user) {
      res
        .status(400)
        .json({ message: "We could not find a match for this link" });
    }

    // otherwise we need to hash the new password  before saving it in the database
    const hashPassword = bcrypt.hashSync(newPassword.password, 8);
    newPassword.password = hashPassword;

    // update user credentials and remove the temporary link from database before saving
    const updatedCredentials = {
      password: newPassword.password,
      reset_link: null,
    };

    await Services.updatePassword(user.id, updatedCredentials);
    res.status(200).json({status: 'success', message: "Password updated", user: user });
  } catch (error) {
    res.status(500).json({status: 'error', message: error.message });
  }
});

module.exports = router;
