require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
let dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlDatabase = {};
let id = 1;

app.post('/api/shorturl',(req,res)=>{
  let url = req.body.url
  if(!isValidUrl(url))
  {
    res.json( { error: 'invalid url' })
  }
  let hostname = new URL(url).hostname;
  dns.lookup(hostname,(err)=>{
    if(err)
    {
      res.json({ error: 'invalid url' })
    }
    else{
      let shortUrl = id++;
      urlDatabase[shortUrl] = url;
      res.json({ original_url: url, short_url: shortUrl });
    }
  })
})

app.get('/api/shorturl/:id',(req,res)=>{
  let id  = req.params.id
  res.redirect(urlDatabase[id])
})

const isValidUrl = (url) => {
  try {
    const urlObject = new URL(url);
    return ['http:', 'https:'].includes(urlObject.protocol);
  } catch (err) {
    return false;
  }}
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
