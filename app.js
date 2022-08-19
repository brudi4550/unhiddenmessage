var http = require('http');
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
  'You get what you want but not what you need',
  'I\'ve looked at life from both sides now,\nFrom win and lose and still somehow\nIt\'s life\'s illusions I recall\nI really don\'t know life at all',
  'Angels lie to keep control',
  'and now you do what they told ya',
  'UNSAINTED',
  'But every once in a while there are those perfect life moments. And that\'s enough. Because it has to be.',
  'Leben ist zu kurz um Angst zu haben.',
  'Don\'t hold me up now. I can stand my own ground. I don\'t need your help now. You will let me down.',
  'Somtimes darkness can show you the light.',
  'I will remember before I forget.',
  'I forgive you.',
  'That\'s when she said \'I don\'t hate you, boy, I just wanna save you while there\'s still something left to save.\'',
  'That\'s when I told her \'I love you girl, but I\'m not the answer to the questions that you still have.\'',
  'Schau die Nacht, sie holt heimlich durch des Vorhangs Falten aus deinem Haar den Sonnenschein.',
  'Die wertvollsten Lektionen tun am meisten weh.'
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
    message: placeholder_message,
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
    message: input,
    quote: getRandomQuote(),
    hash: hash
  })
})

app.get('/random', (req, res) => {
  var input;
  var options = {
    host: 'www.quotable.io',
    path: '/random'
  };

  var str = '';
  var json;
  callback = function (response) {
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      json = JSON.parse(str);
      input = json.content;
      const hash = crypto.createHmac('sha256', process.env.HASH_SECRET)
        .update(input)
        .digest();
      res.render('index', {
        title: 'a message hidden in plain sight',
        message: input,
        quote: getRandomQuote(),
        hash: hash
      })
    });
  }
  http.request(options, callback).end();
})

app.listen(port, () => {
  console.log(`unhiddenmessage listening on port ${port}`)
})
