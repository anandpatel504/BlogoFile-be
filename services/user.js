const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

module.exports = class UserService {
  async findAll(txn) {
    const users = await User.query(txn);
    console.log(users, "txn users");
    return users;
  }

  async createUsers(details) {
    const pass = await bcrypt.hash(details.password, 5);
    details["password"] = pass;
    return await User.query().insertGraph(details);
  }

  async emailChecking(email) {
    const userDetails = await User.query().findOne({
      email: email,
    });
    return userDetails;
  }

  async PassChecking(userInfo, Pass) {
    return await bcrypt.compare(Pass, userInfo.password);
  }

  async findById(userId) {
    const id = await User.query().findById(userId);
    if (id === undefined) {
      return { sorry: `id-${userId} isn't exist in db!` };
    }
    return id;
  }

  async filterBy(filter) {
    if (filter.resetLink) {
      return await User.query().where({ reset_link: filter.resetLink });
    }
    // filter email
    return await User.query().where(filter);
  }

  async update(id, reset_link) {
    return await User.query()
      .update({ reset_link: reset_link.resetLink })
      .where("id", id);
  }

  async updatePassword(id, updateCreadencials) {
    return await User.query().update(updateCreadencials).where("id", id);
  }

  renderHtmlTemplate(filename, variables) {
    const content = fs.readFileSync(
      path.join(__dirname, "../static/templates/" + filename),
      "utf-8"
    );
    var output = mustache.render(content, variables);
    return output;
  }

  async sendEmail(user, token) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        service: process.env.MAIL_SERVICE,
        port: 587,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Reset Password Link - blogofile.herokuapp.com",
        html: await this.renderHtmlTemplate("forgot.html", {
          user_name: user.name,
          token: process.env.BASE_URL+"/reset-password/"+token,
        }),
      });

      console.log("email sent sucessfully");
    } catch (error) {
      console.log(error, "email not sent");
    }
  }
};
