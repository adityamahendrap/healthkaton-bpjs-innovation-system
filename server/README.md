```bash
# install dependencies
$ npm install

# copy example.env to .env
$ cp example.env .env

# create mysql database
$ CREATE DATABASE jkn_bpjs

# migrate database
$ npm run migrate
$ npm run generate

# seed database
$ npm run seed:all
```