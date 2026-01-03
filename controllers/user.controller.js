import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { JWT_SECRET, JWT_EXPIRES_IN, ADMIN_EMAIL } from '../config/env.js';



//===============SIGN UP CONTROLLER========================
export const signUp = async (req, res, next) => {

  //Start Session and Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    //Profile
    const { firstName, lastName, email, password } = req.body;

    if(!firstName || !lastName || !email || !password) {
      return res.status(400).json({message: 'All fields are required'})
    }

    //Proof
    const isExist = await User.findOne({ email }).select('-password');
    if(isExist) return res.status(409).json({msg: 'User already existed'});

    //Password
    const hashed = await bcrypt.hash(password, 10);

    //*SERVER DECIDES THE ROLE (HERE)
    let role = 'user';
    if(email === ADMIN_EMAIL) {
      role = 'admin';
    }


    //Create User
    const user = await User.create([{
      firstName, lastName, email, password: hashed, role
    }], { session });

    //Generate Token
    const token = jwt.sign({
      userId: user._id,
      role: user.role
  },
  JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

  //Commit Transaction and End Session
  await session.commitTransaction();
  session.endSession();

  res.status(200).json({
    success: true,
    message: 'User created successfully',
    data: {
      token,
      user: user
    }
  });

  } catch (error) {
    //Abort Transaction
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


//-------------SIGN IN CONTROLLER---------------
export const signIn = async (req, res, next) => {
  try {
    //Profile
    const { email, password } = req.body;
    if(!email || !password) return res.status(409).json({msg: 'All fields are required'});

    //Proof
    const user = await User.findOne({ email });

    if(!user) return res.status(409).json({msg: 'Invalid email or password'});

    //Compare Password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) return res.status(409).json({msg: 'Invalid email or password'});

    //Generate Token
    const token = jwt.sign({
      userId: user._id,
      role: user.role
    },
    JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

    res.status(200).json({
      success: true,
      message: 'User successfully signed in',
      data: { token, user }
    });

  } catch (error) {
    next(error);
  }
};


//==========Get Current User==========
export const getUser = async (req, res) => {
  try {
    const UserId = req.user._id;
    const { profileId } = req.params;

    const user = await User.findById(UserId)
    .populate('profileId', 'firstName lastName postsCount');

    res.status(200).json({success: true, user});
  } catch (error) {
    res.status(500).json({message: 'Unable to get User'});
  }
};


//**********FOR ADMIN ONLY**************


