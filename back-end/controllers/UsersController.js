const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).populate("role");
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: "Not found user" });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id).populate("role");
    if (!user) {
      res.status(400).json({ message: "Not found user" });
    }
    req.body.password = user.password;
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("role");
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      res.status(400).json({ message: "Not found user" });
    }

    user.isDeleted = true;
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
