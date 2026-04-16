const userModel = require("../models/user.model");
const reviewModel = require("../models/review.model");

async function reviewController(req, res) {
  const { rating,reviewMessage } = req.body;

  const user = req.user;
  const authHeader = req.headers.authorization;

  const token = authHeader.split(" ")[1];

  try {

    if (!authHeader) {
      return res.status(401).json({
        msg: "Register/Login is required !",
        success: false,
      });
    }

    const review = await reviewModel.create({
      rating,
      reviewMessage,
      user:user.id
    });

    res.status(201).json({
      msg: "Thanks for your review",
      review,
      success: true,
    });

  } catch (error) {
    console.log(error.message);
    res.status(400).json({
      msg: "Error in db",
      error: error.message,
      success: false,
    });
  }
}


async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel
      .find()
      .populate("user","username")
      .sort({ createdAt: -1 })
      .select("-__v");

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      msg: error.message
    });
  }
}
module.exports = { reviewController,getAllReviews};
