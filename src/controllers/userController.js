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
    const userProfile = await User.findOne({ email })
      .select('name memberId email avi bio roles subscription lastSeen followersCount followingCount totalStakes totalPayouts -_id');;

    if (!userProfile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    return res.json(userProfile);
    } catch (error) {
      return res.status(500).json({ error: 'Something went wrong' });
    }
};

const followUser = async (req, res) => {
  try {
    const { memberId, followMemberId } = req.params;
    const user = await User.findOne({ memberId });
    const followUser = await User.findOne({ memberId: followMemberId });

    if (!user || !followUser) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    if (user.following.some((follow) => follow.memberId === followMemberId)) {
      return res.status(400).json({ 
        success: false,
        message: 'Already following the user' 
      });
    }

    user.following.push({
      memberId: followMemberId,
      name: followUser.name,
      category: followUser.category,
      avi: followUser.avi
    });
    user.followingCount++; // Increment the following count

    followUser.followers.push({
      memberId,
      name: user.name,
      category: user.category,
      avi: user.avi
    });
    followUser.followerCount++; // Increment the follower count

    await user.save();
    await followUser.save();

    res.status(200).json({ 
      success: true, 
      message: `Successfully followed ${followUser.name}` 
    });
  } catch (error) {
    console.error('Error following user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller to unfollow a user
const unfollowUser = async (req, res) => {
  try {
    const { memberId, unfollowMemberId } = req.params;

    const user = await User.findOne({ memberId });

    const unfollowUser = await User.findOne({ memberId: unfollowMemberId });

    if (!user || !unfollowUser) {
      return res.status(404).json({ 
        success: false, message: 'User not found' 
      });
    }

    if (!user.following.some((follow) => follow.memberId === unfollowMemberId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not following the user' 
      });
    }

    user.following = user.following.filter((follow) => follow.memberId !== unfollowMemberId);
    user.followingCount = user.followingCount > 0 ? user.followingCount - 1 : 0;

    unfollowUser.followers = unfollowUser.followers.filter((follow) => follow.memberId !== memberId);
    unfollowUser.followersCount = unfollowUser.followersCount > 0 ? unfollowUser.followersCount - 1 : 0;

    await user.save();
    await unfollowUser.save();

    res.status(200).json({ success: true, message: `Successfully unfollowed ${unfollowUser.name}` });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const recommendUsers = async (req, res) => {
  try {
    const { memberId } = req.query;

    // Retrieve the user's following list
    const user = await User.findOne({ memberId }).select('following.memberId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followedUsers = user.following.map((followingUser) => followingUser.memberId);

    // Exclude the followed users and the requesting user from the recommendation query
    const users = await User.find({ memberId: { $nin: [...followedUsers, memberId] } }).select('-_id memberId name avi category');

    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      users
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
};



const getFollowers = async (req, res) => {
  try {
    const { memberId } = req.query;

    const user = await User.findOne({ memberId }).select('-_id followers.memberId followers.name followers.category followers.avi');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const followers = user.followers;

    res.status(200).json({
      success: true,
      message: 'Followers retrieved successfully',
      followers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
};

const getFollowing = async (req, res) => {
  try {
    const { memberId } = req.query;

    const user = await User.findOne({ memberId }).select('-_id following.memberId following.name following.category following.avi');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const following = user.following;

    res.status(200).json({
      success: true,
      message: 'Following retrieved successfully',
      following
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Something went wrong', error });
  }
};


module.exports = { 
  deleteUser, 
  updateUser, 
  getAllUsers,  
  getUserProfile, 
  addCreator,
  followUser,
  unfollowUser,
  recommendUsers,
  getFollowers,
  getFollowing
};
