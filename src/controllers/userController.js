const User = require("../models/user");
const bcrypt = require('bcrypt');

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { email, password, name, avi, bio } = req.body;
  
    //-- Checks if user exists --//
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
    //-- Update user --//
    user.email = email || user.email;
    user.password = password || user.password;
    user.name = name || user.name;
    user.avi = avi || user.avi;
    user.bio = bio || user.bio;
    const updatedUser = await user.save();
  
    return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
};

const deleteUser = async (req, res) => {
  try {
    const { memberId } = req.params;
    //-- Check if user exists
    const user = await User.findOneAndDelete({ memberId });

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
};

const getUserRole = (roles) => {
  if (!Array.isArray(roles)) {
    return 'Unknown';
  }
  
  if (roles.includes(2023)) {
    return 'Admin';
  } else if (roles.includes(2020)) {
    return 'Creator';
  } else if (roles.includes(1998)) {
    return 'User';
  } else {
    return 'Unknown';
  }
};

const generateMemberId = () => {
  //-- Function to generate a unique memberId --//
  const randomString = Math.random().toString(36).substring(2, 8);
  return `CID-${randomString}`;
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    const formattedUsers = users.map((user, index) => ({
      id: index + 1,
      name: user.name,
      memberId: user.memberId,
      email: user.email,
      subscription: user.subscription,
      joined: user.created_at,
      lastSeen: user.lastSeen,
      role: getUserRole(user.roles)
    }));
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users: formattedUsers,
    });
  } catch (error) {
    return res.status(500).json({success: true, message: 'Something went wrong', error: error  });
 }
};

const addCreator = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    //-- Check that all required fields are present --//
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Check if creator already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
       return res.status(409).json({ success: false, error: 'Creator already exists' });
    };

    //-- Create new user object with provided fields --//
    const memberId = generateMemberId(); // Function to generate unique memberId
    const hashedPwd = await bcrypt.hash(password,10);
    const user = new User({ email, password: hashedPwd, name, memberId, roles: [2020] });
    await user.save();

    return res.status(201).json({
      success: true,
      message: `New creator with ${email} was created`,
    });

  } catch (error) {
    return res.status(500).json({success: false, message: 'Something went wrong', error  });
  }
};

const getUserProfile = async (req, res) => {
  try {
    //-- Get the user ID from the request object --//
    const { email } = req;
    console.log(email)
    const userProfile = await User.findOne({ email }).select('name memberId email avi bio roles subscription lastSeen -_id');;

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
};

module.exports = { deleteUser, updateUser, getAllUsers,  getUserProfile, addCreator };
