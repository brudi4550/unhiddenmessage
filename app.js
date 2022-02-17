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
    'Keep on keeping on',
    'You make me want to be a better person',
    'I can\'t put into words how much I love you',
    'Will you marry me?',
    'Happy birthday!',
    'I somehow can\'t escape my demons',
    'I\'m so alone',
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
  },
  {
    'quote': 'Be yourself; everyone else is already taken.',
    'quotee': 'Oscar Wilde'
  },
  {
    'quote': 'Be who you are and say what you feel, because those who mind don\'t matter, and those who matter don\'t mind.',
    'quotee': 'Bernard M. Baruch'
  },
  {
    'quote': 'If you don\'t stand for something you will fall for anything.',
    'quotee': 'Gordon A. Eadie'
  },
  {
    'quote': 'I may not have gone where I intended to go, but I think I have ended up where I needed to be.',
    'quotee': 'Douglas Adams'
  },
  {
    'quote': 'Life isn\'t about finding yourself. Life is about creating yourself.',
    'quotee': 'George Bernard Shaw'
  },
  {
    'quote': 'It is better to be hated for what you are than to be loved for what you are not.',
    'quotee': 'Andre Gide'
  },
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
