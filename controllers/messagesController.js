const db = require('../db/queries');

const CustomNotFoundError = require('../errors/CustomNotFoundError');
const CustomValidationError = require('../errors/CustomValidationError');

// Show all messages
exports.showAllMessages = async (req, res, next) => {
  try {
    const messages = await db.getAllMessages();
    res.render('index', { title: 'Mini Message Board', messages });
  } catch (err) {
    next(err);
  }
};

// Show message details
exports.showMessageDetails = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const message = await db.getMessageById(messageId);

    if (!message) {
      return next(new CustomNotFoundError("Message not found"));
    }

    res.render('details', { title: 'Message Details', message });
  } catch (err) {
    next(err);
  }
};

// Show new message form
exports.showNewMessageForm = async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.render('new', { title: 'New Message', users });
  } catch (err) {
    next(err);
  }
};

// Submit new message
exports.handleNewMessage = async (req, res, next) => {
  try {
    const { userId, userName, content } = req.body;
    let user;

    const normalizedName = userName.trim();
    const normalizedContent = content.trim();

    if (userId) {
      user = await db.getUserById(userId);
    } else {
      const existing = await db.findUserByName(normalizedName);
      user = existing || await db.createUser(normalizedName);
    }
    await db.addMessage(user.id, normalizedContent);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

// Show update message form
exports.showUpdateMessageForm = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const message = await db.getMessageById(messageId);
    const users = await db.getAllUsers();

    if (!message) {
      return next(new CustomNotFoundError("Message not found"));
    }

    res.render('update', { 
      title: 'Update Message',
      users,
      message
    });
  } catch (err) {
    next(err);
  }
};


// Update message
exports.handleUpdateMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return next(new CustomValidationError("Message content cannot be empty"));
    }

    const updatedMessage = await db.updateMessage(messageId, content);
    if (!updatedMessage) {
      return next(new CustomNotFoundError("Message not found"));
    }

    res.redirect(`/`);
  } catch (err) {
    next(err);
  }
};

// Delete message
exports.handleDeleteMessage = async (req, res, next) => {
  try {
    const messageId = req.params.id;
    const message = await db.getMessageById(messageId);

    if (!message) {
      return next(new CustomNotFoundError("Message not found"));
    }

    await db.deleteMessage(messageId);
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};
