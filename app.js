const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const crypto = require('crypto');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.use(express.static('public'));


const placeholder_messages = [
    'I love you, Mom & Dad',
    'Carpe diem',
    'I can\'t seem to escape my demons',
    'Caring about caring about others',
    'keep on keeping on'
]

function getRandomMessage() {
    return placeholder_messages[Math.floor(Math.random() * placeholder_messages.length)];
}

const quotes = [
  {
    'quote': 'Every science touches art at some points—every art has its scientific side.',
    'quotee': 'Armand Trousseau'
  },
  {
    'quote': 'We don\'t make mistakes, just happy little accidents.',
    'quotee': 'Bob Ross'
  }
]

function getRandomQuote() {
    return quotes[Math.floor(Math.random() * quotes.length)];
}

app.get('/', (req, res) => {
  const placeholder_message = getRandomMessage();
  const hash = crypto.createHmac('sha256', process.env.HASH_SECRET)
    .update(placeholder_message)
    .digest();
  res.render('index', {
    title: 'A message hidden in plain sight',
    placeholder_message: placeholder_message,
    quote: getRandomQuote(),
    hash: hash
  })
})

app.post('/', (req, res) => {
  const input = req.body.message;
  const hash = crypto.createHmac('sha256', process.env.HASH_SECRET)
    .update(input)
    .digest();
  res.render('index', {
    title: 'A message hidden in plain sight',
    placeholder_message: input,
    quote: getRandomQuote(),
    hash: hash
  })
})

app.listen(port, () => {
  console.log(`unhiddenmessage listening on port ${port}`)
})
