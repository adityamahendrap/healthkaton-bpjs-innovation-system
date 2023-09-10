For javascript environment:
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

For python environment:
```bash
# change directory to experimental
$ cd experimental

# install dependencies
$ pip install -r requirements.txt
```