import User from "../models/User.js";
import { connectToDb } from "../utils/db.js";
import ExpressError from "../utils/ExpressError.js";
import bcrypt from "bcrypt";
import { signJwt } from "../utils/jwt.js";


export const signupUser = async (req, res) => {
  connectToDb();
  console.log("Inside signup")
  const { email, username, password } = req.body;

  if (!username) throw new ExpressError(404, "Username not found.");
  if (!email) throw new ExpressError(404, "Email not found.");
  if (!password) throw new ExpressError(404, "Password not found.");
  const existUser1 = await User.findOne({ email: email });
  if (existUser1) {
    return res
      .status(201)
      .json({ message: "Email already exists"});
  }
  const existUser2 = await User.findOne({ username: username });
  if (existUser2) {
    return res
      .status(201)
      .json({ message: "Username already exists"});
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    email,
    username,
    password: hashedPassword,
  });

  const result = await user.save();
  return res.status(200).json({ message: "USERSIGNEDUP" });
};

export const loginUser = async (req, res) => {
  await connectToDb();
  console.log("inside login")

  const { username, password } = req.body;
  if (!username) throw new ExpressError(404, "Email not found.");
  if (!password) throw new ExpressError(404, "Password not found.");

  const user = await User.findOne({ username: username });
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) throw new ExpressError(400, "Passwords do not match");
  const payload = {id: user._id, username: user.username};
  const token = signJwt(payload);
  return res.status(200).json({ message: "LOGGED", user: payload, token});
};
