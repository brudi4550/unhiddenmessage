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
    'Keep fighting',
    'You are not alone',
    'I\'m here for you',
    'Things will get better',
    'Am I a part of the cure or am I part of the disease?',
    'Let it go',
    'Aut inveniam viam aut faciam',
    'Dum spiro spero',
    'I\'ve looked at life from both sides now,\nFrom win and lose and still somehow\nIt\'s life\'s illusions I recall\nI really don\'t know life at all',
    'Now we are free',
    'I remember those summers that stretched on without end. The future called so loudly, and the oaks, the oaks were silent then. Silence forever conversations in my head, might not have changed your mind, but if we\'d spoken here\'s what I would have said. Erase, destroy this place. Don\'t miss this chance, it will not come again. You mean more thank you may ever know. Don\'t linger where the moss slowly grows.',
    'Make your life spectacular. I know I did.',
    'All you touch and all you see - Is all your life will ever be',
    'Breathe out, so I can breathe you in',
    'They\'re sharing a drink they call loneliness, but its better than drinking alone',
    'All I ever wanted\nAll I ever needed \nIs here in my arms\nWords are very unnecessary\nThey can only do harm'
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
    title: 'a message hidden in plain sight',
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
    title: 'a message hidden in plain sight',
    placeholder_message: input,
    quote: getRandomQuote(),
    hash: hash
  })
})

app.listen(port, () => {
  console.log(`unhiddenmessage listening on port ${port}`)
})
