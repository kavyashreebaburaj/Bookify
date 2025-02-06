const router = require("express").Router();
const Issue = require("../models/issuesModel");
const Book = require("../models/booksModel");
const authMiddleware = require("../middlewares/authMiddleware");

// issue a book to patron
router.post("/issue-new-book", authMiddleware, async (req, res) => {
  try {
    const { user, book, returnDate } = req.body; // Ensure returnDate is received from frontend

    // 1. Check if the same book is already issued to the same user
    const existingIssue = await Issue.findOne({ user: user, book: book, status: "issued" });
    if (existingIssue) {
      return res.status(400).send({
        success: false,
        message: "This book has already been issued to this user.",
      });
    }

    // 2. Limit the number of books per user to 2 (only count books with status "issued")
    const issuedBooksCount = await Issue.countDocuments({ user: user, status: "issued" });
    if (issuedBooksCount >= 2) {
      return res.status(400).send({
        success: false,
        message: "A user can only issue up to 2 books.",
      });
    }

    // 3. Check if there are available copies to issue
    const bookDetails = await Book.findById(book);
    if (!bookDetails) {
      return res.status(404).send({
        success: false,
        message: "Book not found.",
      });
    }
    
    if (bookDetails.availableCopies <= 0) {
      return res.status(400).send({
        success: false,
        message: "No copies available to issue.",
      });
    }

    // 4. Validate that returnDate is provided
    if (!returnDate) {
      return res.status(400).send({
        success: false,
        message: "Return date is required.",
      });
    }

    // 5. Update available copies **before** creating an issue record
    const updatedBook = await Book.findOneAndUpdate(
      { _id: book, availableCopies: { $gt: 0 } }, // Ensure copies > 0 before decrementing
      { $inc: { availableCopies: -1 } },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(400).send({
        success: false,
        message: "Failed to issue book due to availability.",
      });
    }

    // 6. Issue the book (create a new issue record with returnDate)
    const newIssue = new Issue({
      user,
      book,
      issueDate: new Date(),
      returnDate: new Date(returnDate), // Store returnDate properly
      status: "issued",
    });

    await newIssue.save();

    return res.send({
      success: true,
      message: "Book issued successfully",
      data: newIssue,
    });
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
    const { book, _id, user } = req.body;

    // Ensure we're using only the user ID if the user object is passed
    const userId = typeof user === "object" ? user._id : user;

    // 1. Increase available copies in the Book collection
    const bookUpdate = await Book.findOneAndUpdate(
      { _id: book },
      { $inc: { availableCopies: 1 } },
      { new: true }
    );

    if (!bookUpdate) {
      return res.status(404).send({
        success: false,
        message: "Book not found.",
      });
    }

    // 2. Mark the issue as returned
    const issueUpdate = await Issue.findOneAndUpdate(
      { _id: _id, user: userId },
      { status: "returned", returnedDate: new Date() },
      { new: true }
    ).lean(); // Use .lean() to get a plain JavaScript object

    if (!issueUpdate) {
      return res.status(404).send({
        success: false,
        message: "Issue record not found.",
      });
    }

    // 3. Modify the user field to only contain the user ID (not the full object)
    issueUpdate.user = issueUpdate.user._id;

    return res.send({
      success: true,
      message: "Book returned successfully",
      data: issueUpdate,
    });
  } catch (error) {
    return res.status(500).send({
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