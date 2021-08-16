<img alt="Wiscro" src="https://raw.githubusercontent.com/Araekiel/wiscro/master/public/images/wiscro.png" height="100">

# Wiscro

Wiscro is a Q&A web-app based on the "Wisdom of the Crowd" hypothesis made with Node.js, Express, MongoDB, Mongoose, Handlebars and jQuery.
Users can ask questions to other users and answer other users' questions by choosing one of the two options, anonymously.

> This is a prototype. <br/>
> Quick Update (2021): This project is from 2017-18 and has a bunch of security issues, and on top of that I was still new to Node.js while working on it - hence, I wouldn't recommend using any of the code in this repo. Also, the mLab add-on on Heroku was discontinued last year, which means that the current deployment has no database and cannot be used, so, I'm adding a GIF that showcases how wiscro is supposed to work (for those who don't want to clone the repo).

<img alt="Gif" src="https://raw.githubusercontent.com/Araekiel/wiscro/master/assets/wiscro.gif">

## Getting Started

### Prerequisites

[Git](https://git-scm.com/) is needed to clone the repository on your machine.
Use [Node.js](https://nodejs.org/en/download/) and the package manager [npm](https://www.npmjs.com/get-npm) that is installed along with it to run Wiscro on your machine.
[MongoDB](https://www.mongodb.com/download-center) is needed to be installed and running before running the app or it will crash.

### Installing and Running

After installing git, clone the repository on your machine

```bash
git clone https://github.com/Araekiel/wiscro.git
```

Then install the node-modules in package.json

```bash
npm install
```

After installing MongoDB run the following code in the bin directory in it's installation folder

```bash
mongod.exe --dbpath ./../mongo-data
```

> mongo-data is the folder where the data will be saved

Set the port you want to run the app on in server/server.js on line 14

```bash
const port = *port*;
```

Then run the app

```bash
npm start
```

Open a browser and type **localhost:_port_**

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

- **Araekiel** - [Github](https://github.com/Araekiel)

## License

[MIT License](https://github.com/Araekiel/wiscro/blob/master/LICENSE) | Copyright (c) 2020 Kumar Shashwat
