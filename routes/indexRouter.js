const { Router } = require('express');

const indexRouter = Router();

const CustomNotFoundError = require('../errors/CustomNotFoundError');

const messages = [
  {
    text: 'Thought-provoking quip.',
    user: 'McArthur Genius',
    added: new Date()
  },
  {
    text: 'Funny joke!',
    user: 'Master Yoda',
    added: new Date()
  }
];


// Routes

indexRouter.get('/', (req, res) => {
  res.render('index', 
    { 
      title: 'Mini Message Board',
      messages: messages
    });
});

indexRouter.get('/new', (req, res) => {
  res.render('form');
});

indexRouter.get('/messages/:messageId', (req, res) => {
  const { messageId } = req.params;
  
  if (!messages[Number(messageId)]) {
    throw new CustomNotFoundError("Message not found")
  };

  res.render('message', 
    { title: 'Message Details', 
      message: messages[Number(messageId)] 
    });
});

indexRouter.post('/new', (req, res) => {
  messages.push({ 
    text: req.body.messageText,
    user: req.body.messageUser,
    added: new Date()
  });
  res.redirect('/');
});

// Catch-all 404 handler
indexRouter.get('/{*splat}', (req, res) => {
  console.log(`Caught by catch-all: ${req.originalUrl}`);
  throw new CustomNotFoundError("404 - Page not found");
});

module.exports = indexRouter;