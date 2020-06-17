#!/bin/bash

# Local: ./bin/fetchquotes.sh from application root directory.
# Heroku: heroku run ./bin/fetchquotes.sh
curl -u $HTTP_AUTH_USERNAME:$HTTP_AUTH_PASSWORD https://www.bitcoin-quotes.com/quotes.json | python -m json.tool > ../src/quotes.json
