const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();

const generateMemberId = () => {
  //-- Function to generate a unique memberId --//
  const randomString = Math.random().toString(36).substring(2, 8);
  return `MID-${randomString}`;
}


const handleUserSignUp = async (req, res) => {
  try {
    const { email, password, name, avi, bio } = req.body;
  
    //-- Check that all required fields are present --//
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
       return res.status(409).json({ success: false, error: 'User already exists' });
    }
  
    //-- Create new user object with provided fields --//
    const memberId = generateMemberId(); // Function to generate unique memberId
    const hashedPwd = await bcrypt.hash(password,10);
    const user = new User({ email, password: hashedPwd, name, avi, bio, memberId  });
    await user.save();
  
    return res.status(201).json({
      success: true,
      message: `New user with ${email} was created`,
    });
  } catch (error) {
    //-- Handle any errors that occur during the try block with a 500 status code --//
    return res.status(500).json({ success: false, message: 'Something went wrong', error: error.message});
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    //-- Check that all required fields are present --//
    if (!email || !password ) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

     //-- Checks if user exists --//
     const user = await User.findOne({ email }).select('roles password email refreshToken');

     if (!user) return res.status(401).json({ error: true, message: 'Email or password is incorrect' }); //--> Unauthorized user

     const passwordMatch = await bcrypt.compare(password, user.password);
     if (passwordMatch) {
        const accessToken = jwt.sign(
          {
            "UserInfo": {
              "email": user.email,
              "roles": user.roles
            }
          },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '5m'}
      );

      const refreshToken = jwt.sign(
        {
          "UserInfo": {
            "email": user.email,
            "roles": user.roles
          }
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d'}
      );

      user.refreshToken = refreshToken;
      await user.save();
      
      res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
      res.json({ result : { accessToken, refreshToken} })
     } else { 
      res.sendStatus(401);
     }
     
    } catch (error) {
      // Send an error response if something goes wrong
      res.status(500).json({ error: error.message });
    }
};

const handleUserLogout = async ( req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //--> No content
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken });
    if (!foundUser) {
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.sendStatus(204);
    }

    //-- Delete Refresh token
    foundUser.refreshToken = "";
    await foundUser.save();

    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.sendStatus(204);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {handleUserSignUp, handleUserLogin, handleUserLogout};