const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const {
      avatar,
      fullName,
      password,
      email,
      phoneNumber,
      createdAt,
      birthday,
      role,
      degree,
    } = req.body;

    // Check email was Regstered ?
    const findEmail = await User.findOne({ email: email });
    if (findEmail != null) {
      res.status(400).json({ message: err });
      return;
    }

    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      avatar: avatar,
      fullName: fullName,
      password: hashedPassword,
      email: email,
      phoneNumber: phoneNumber,
      createdAt: createdAt,
      birthday: birthday,
      role: role,
      degree: degree,
    };
    const response = await User.create(user);
    return res
      .status(200)
      .json({ message: "Register Successful !", status: 200 });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(404)
        .json({ message: "Email or Password is required !" });
    }
    const user = await User.findOne({ email: email });
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "Email is Invalid !" });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(404).json({ message: "Password is Invalid !" });
    }
    const token = await jwt.sign(
      { _id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    return res.header("auth-token", token).send({ token: token, user: user });
  } catch (err) {
    return res.status(400).json({ message: err, body: req.body });
  }
};

exports.getAccount = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).populate("role");
  if (!user) {
    return res.status(404).json({ message: "Not Found !" });
  }

  return res.status(200).json(user);
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, id } = req.body;
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findById(id);
    var isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ message: "Mật khẩu cũ không đúng!" });
    }
    if (isValid) {
      user.password = hashedNewPassword;
      await user.save();
      res.status(200).json({ message: "Success" });
    }
  } catch (err) {
    //Do nothing
  }
};
