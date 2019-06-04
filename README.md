<img alt="Wiscro" src="https://raw.githubusercontent.com/KSSBro/wiscro/master/public/images/wiscro_main.png" height="100">

# Wiscro

Wiscro is a web-app made with Node.js, Express, MongoDB, Mongoose, Handlebars and JQuery.
Users can ask questions to other users and answer other user's questions by choosing one of the two options, anonymously.

## Getting Started

### Prerequisites

[Git](https://git-scm.com/) is needed to clone the repository on your machine.
Use [Node.js](https://nodejs.org/en/download/) and the package manager [npm](https://www.npmjs.com/get-npm) that is installed along with it to run Wiscro on your machine.
[MongoDB](https://www.mongodb.com/download-center) is needed to be installed and running before running the app or it will crash.

### Installing and Running

After installing git, clone the repository on your machine

```
git clone https://github.com/KSSBro/unicode.git
```

After installing MongoDB run the following code in the bin directory in it's installation folder

```
mongod.exe --dbpath ./../mongo-data
```

> mongo-data is the folder where the data will be saved

Then install the node-modules in package.json

```
npm install
```

Then run the app

```
npm start
```

## Deployment

This app is deployed on Heroku. Link to the app - [Wiscro](https://wiscro.herokuapp.com/)

## Built With

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Handlebars](https://handlebarsjs.com/)
- [JQuery](https://jquery.com/)

## Authors

- **KSSBro** - [Github](https://github.com/KSSBro)

## License

[ISC](https://choosealicense.com/licenses/isc/)
