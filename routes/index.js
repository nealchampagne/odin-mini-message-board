const router = require('express').Router();
const messagesController = require('../controllers/messagesController');

const CustomNotFoundError = require('../errors/CustomNotFoundError');

// Show new message form
router.route('/new')
  .get(messagesController.showNewMessageForm)
  .post(messagesController.handleNewMessage);

// Show message details
router.get('/show/:id', messagesController.showMessageDetails);

// Update message
router.route('/:id/edit')
  .get(messagesController.showUpdateMessageForm)
  .post(messagesController.handleUpdateMessage);

// Delete message
router.delete('/:id', messagesController.handleDeleteMessage);

// Show all messages  
router.get('/', messagesController.showAllMessages);

module.exports = router;