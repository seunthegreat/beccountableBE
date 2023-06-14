const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { sendEmailWithOTP } = require("../Services/handlebars");
const { generateOTP } = require("../Services/otpGenerator");

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

const getStarted = async (req, res) => {
  const {
    email,
    firstName,
    lastName,
    password,
    newUser,
    location,
    interests,
    dob,
    gender,
    avi,
    socialMediaUrl
  } = req.body;

  // Set CORS headers to allow cross-origin requests
  res.header('Access-Control-Allow-Origin', 'https://beccountable-frontend.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, *');

  // Retrieve the email from the request body or the cookie
  const storedEmail = email || req.cookies.email;
  console.log(storedEmail);

  try {
    let existingUser;

    // Step one: Create a new user if it doesn't exist
    if (!storedEmail) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    existingUser = await User.findOne({ email: storedEmail });

    if (!existingUser) {
      if (newUser === true) {
        const memberId = generateMemberId();
        const profileProgress = {
          totalSteps: 9,
          completedSteps: 1,
        };

        existingUser = new User({
          memberId,
          email: storedEmail,
          profileProgress,
        });

        await existingUser.save();

        // Set the email in an HTTP-only cookie
        res.cookie('email', storedEmail, { httpOnly: true });

        return res.status(200).json({
          success: true,
          message: 'Email saved and profile progress updated',
          email: storedEmail,
          profileProgress: existingUser.profileProgress,
        });
      } else {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
    }

    const { email: existingEmail, profileProgress } = existingUser;

    // Step two: Update user information based on profile progress
    if (
      profileProgress.completedSteps === 1 &&
      firstName &&
      lastName &&
      password
    ) {
      const hashedPwd = await bcrypt.hash(password, 10);
      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.password = hashedPwd;
      existingUser.profileProgress.completedSteps++;
      await existingUser.save();

      // Set the email in an HTTP-only cookie
      res.cookie('email', storedEmail, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        email: storedEmail,
        profileProgress: existingUser.profileProgress,
      });
    }

    // Step three: Update user location
    if (
      profileProgress.completedSteps === 2 &&
      location
    ) {
      existingUser.location = location;
      existingUser.profileProgress.completedSteps++;
      await existingUser.save();

      // Set the email in an HTTP-only cookie
      res.cookie('email', storedEmail, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        email: storedEmail,
        profileProgress: existingUser.profileProgress,
      });
    }

    // Step four: Update user interests
    if (
      profileProgress.completedSteps === 3 &&
      interests
    ) {
      existingUser.interests = interests;
      existingUser.profileProgress.completedSteps++;
      await existingUser.save();

      // Set the email in an HTTP-only cookie
      res.cookie('email', storedEmail, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        email: storedEmail,
        profileProgress: existingUser.profileProgress,
      });
    }

     // Step five: Basic Info
     if (
      profileProgress.completedSteps === 4 &&
      dob && gender
    ) {
      existingUser.dob = dob;
      existingUser.gender = gender;
      existingUser.profileProgress.completedSteps++;
      await existingUser.save();

      // Set the email in an HTTP-only cookie
      res.cookie('email', storedEmail, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        email: storedEmail,
        profileProgress: existingUser.profileProgress,
      });
    }

    // Step six: Update user avi and socialMediaUrl
    if (
      profileProgress.completedSteps === 5 && socialMediaUrl
    ) {

      const otp = generateOTP();

      existingUser.avi = avi;
      existingUser.socialMediaUrl = socialMediaUrl;
      existingUser.profileProgress.completedSteps++;
      existingUser.otp = otp;
      await existingUser.save();

      sendEmailWithOTP(existingUser.name, storedEmail, otp);

      // Set the email in an HTTP-only cookie
      res.cookie('email', storedEmail, { httpOnly: true });

      return res.status(200).json({
        success: true,
        message: 'User information updated successfully',
        email: storedEmail,
        profileProgress: existingUser.profileProgress,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User already exists',
      email: existingEmail,
      profileProgress,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error });
  }
};

const verifyOTP = async (req, res) => {
  const { otp } = req.body;
  const userEmail = req.cookies.email;

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email not found' });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    console.log(user.otp, otp)
    if (user.otp === otp) {
      
      user.otp = null;
      user.isVerified = true;
      await user.save(); // Save the updated user object

      // Perform the required action upon successful OTP verification
      return res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const resendOTP = async (req, res) => {
  const userEmail = req.cookies.email;
  const otp = generateOTP();

  if (!userEmail) {
    return res.status(400).json({ success: false, message: 'Email not found' });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    sendEmailWithOTP(user.firstName, userEmail, otp);
    user.otp = otp;
    await user.save();

    return res.status(200).json({success: true, message: 'OTP resent successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}

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

module.exports = {
  handleUserSignUp, 
  handleUserLogin, 
  handleUserLogout,
  getStarted,
  verifyOTP,
  resendOTP
};