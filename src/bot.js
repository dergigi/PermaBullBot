const Twit = require('twit')
const bent = require('bent');
const getJSON = bent('json')

const config = require('./config')
const quotes = require('./quotes.json')

const bot = new Twit(config)

const TWITTER_URL = 'https://twitter.com/'
const GREETING = 'Good morning bitcoiners. '
const BULLISH = ' Bullish.'

async function postRandomQuote() {
  var quoteWithAuthor = ""
  do {
    // Pick a random quote
    var quote = quotes[Math.floor(Math.random()*quotes.length)]
    quote = GREETING + quote['body'] + BULLISH
    quote = await replacePlaceholders(quote)
    if (quote.length > config.character_limit) {
      console.log("Quote too long to be posted on twitter. Picking another one...")
    }
  } while (quoteWithAuthor.length > config.character_limit)

  // Post to twitter
  postTweet(quote)
}

async function replacePlaceholders(quoteStr) {
  if (!quoteStr.includes('$')) {
    return quoteStr
  }

  // BLOCKHEIGHT
  let latestblock = await getJSON('https://blockchain.info/latestblock')
  let height = latestblock["height"];

  // BLOCKSUNTIL21
  let blocksuntil21 = 6930000 - height

  // REWARDERA
  let rewardera = Math.floor(height / 210000) + 1
  let rewarderastogo = 34 - rewardera

  // BLOCKSTOHALVING
  let blocksafterhalving = height % 210000
  let blockstohalving = 210000 - blocksafterhalving

  quoteStr = quoteStr.replace('$BLOCKHEIGHT', height)
  quoteStr = quoteStr.replace('$BLOCKSTOHALVING', blockstohalving)
  quoteStr = quoteStr.replace('$REWARDERA', rewardera)
  quoteStr = quoteStr.replace('$REWARDERASTOGO', rewarderastogo)
  quoteStr = quoteStr.replace('$BLOCKSUNTIL21', blocksuntil21)

  return quoteStr
}

/**
 * Post quote to Twitter.
 * @param {string} quoteStr - The quote to post as a String.
*/
function postTweet(quoteStr) {
  if (config.post_to_twitter) {
    console.log("Posting quote to timeline...")
    bot.post('statuses/update', { status: quoteStr }, function(err, data, response) {
      console.log(data)
    })
  } else {
    console.log(quoteStr)
    console.log(quoteStr.length + " chars")
    console.log("(Not posting quote to timeline. ENV var POST_TO_TWITTER has to be set to true.)")
  }
}

module.exports.quotes = quotes;
module.exports.postRandomQuote = postRandomQuote;
