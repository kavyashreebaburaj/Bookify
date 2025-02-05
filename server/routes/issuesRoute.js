const router = require("express").Router();
const Issue = require("../models/issuesModel");
const Book = require("../models/booksModel");
const authMiddleware = require("../middlewares/authMiddleware");

// issue a book to patron
// Issue a book to a patron
router.post("/issue-new-book", authMiddleware, async (req, res) => {
  try {
    const { book, user } = req.body;

    // Step 1: Fetch book details and validate existence
    const bookDetails = await Book.findById(book);
    if (!bookDetails) {
      return res.status(400).send({
        success: false,
        message: "Book not found.",
      });
    }

    // Step 2: Check if the book is available
    if (bookDetails.availableCopies <= 0) {
      return res.status(400).send({
        success: false,
        message: "Book is not available for borrowing.",
      });
    }

    // Step 3: Check if the user has already borrowed this book
    const existingIssue = await Issue.findOne({ user, book, status: "issued" });
    if (existingIssue) {
      return res.status(400).send({
        success: false,
        message: "This Book is already issued.",
        //"You have already borrowed this book."
      });
    }

    // Step 4: Check if the user has exceeded the borrow limit
    const userIssues = await Issue.find({ user, status: "issued" });
    if (userIssues.length >= 2) {
      return res.status(400).send({
        success: false,
        message: "Maximum of two books can be issued for an user",
      });
    }

    // Step 5: Issue the book and update inventory atomically
    const session = await Issue.startSession();
    session.startTransaction();

    try {
      const newIssue = new Issue({ book, user, status: "issued", issueDate: new Date() });
      await newIssue.save({ session });

      await Book.findByIdAndUpdate(book, { $inc: { availableCopies: -1 } }, { session });

      await session.commitTransaction();
      session.endSession();

      return res.status(200).send({
        success: true,
        message: "Book issued successfully.",
        data: newIssue,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});

// get issues
router.post("/get-issues", authMiddleware, async (req, res) => {
  try {
    delete req.body.userIdFromToken;
    const issues = await Issue.find(req.body).populate("book").populate("user").sort({ issueDate: -1 });
    return res.send({
      success: true,
      message: "Issues fetched successfully",
      data: issues,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// return a book
router.post("/return-book", authMiddleware, async (req, res) => {
  try {
    // inventory adjustment (available copies must be incremented by 1)
    await Book.findOneAndUpdate(
      {
        _id: req.body.book,
      },
      {
        $inc: { availableCopies: 1 },
      }
    );

    // return book (update issue record)
    await Issue.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      req.body
    );

    return res.send({
      success: true,
      message: "Book returned successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

// delete an issue
router.post("/delete-issue", authMiddleware, async (req, res) => {
  try {
    // inventory adjustment (available copies must be incremented by 1)
    await Book.findOneAndUpdate(
      { _id: req.body.book },
      { $inc: { availableCopies: 1 } }
    );

    // delete issue
    await Issue.findOneAndDelete({ _id: req.body._id });
    res.send({ success: true, message: "Issue deleted successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

// edit an issue
router.post("/edit-issue", authMiddleware, async (req, res) => {
  try {
    await Issue.findOneAndUpdate({
      _id: req.body._id,
    }, req.body);
    res.send({ success: true, message: "Issue updated successfully" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

module.exports = router;