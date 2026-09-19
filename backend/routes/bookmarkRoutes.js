const express = require('express');
const router = express.Router();
const { addBookmark, getBookmarks, removeBookmark } = require('../controllers/bookmarkController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .post(addBookmark)
  .get(getBookmarks);

router.delete('/:materialId', removeBookmark);

module.exports = router;
