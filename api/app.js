var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var express = require('express');
var timeout = require('connect-timeout');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testAPIRouter = require('./routes/testAPI')
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kalambury"
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(timeout('1s'));
app.use(cookieParser());
app.use(haltOnTimedout);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/testAPI', testAPIRouter);

//Logowanie
app.post('/login', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let user = req.body;
  console.log(user);
  con.query(`SELECT id FROM users WHERE name='${user[0]}' AND password='${user[1]}'`, function (err, result, fields) {
    if (err) throw err;
    global.globalId = result;
  });
  con.query(`INSERT INTO ranking (userName, userPoints) VALUES ('${user[0]}','0')`, function (err, result, fields) {
    if (err) throw err;
  });
})
app.get('/login', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  res.end(JSON.stringify(globalId));
})

//Rejestracja
app.post('/signup', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let user = req.body;
  console.log(user);
  con.query(`INSERT INTO users (name, password, email) VALUES ('${user[0]}','${user[1]}','${user[2]}')`, function (err, result, fields) {
    if (err) throw err;
    console.log("Dodano użytkownika!");
  });
})

//lista zalogowanych użytkowników
var usersList = [];
app.post('/isLogged', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let userName = req.body;
  // console.log(userName);
  if(usersList.includes(userName[0])===true) return null;
  else return usersList.push(userName[0]);
})
app.get('/loggedUsersList', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  res.end(JSON.stringify(usersList));
  // console.log(usersList);
})

//Ranking
app.get('/usersRanking', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`SELECT * FROM ranking WHERE id IN (SELECT MAX(id) FROM ranking GROUP BY userName) ORDER BY userPoints DESC`, function (err, result, fields) {
    if (err) throw err;
    var newResult = result.map((result)=>[result.userName, result.userPoints]);
    res.end(JSON.stringify(newResult));
  })
})

//aktualizacja rankingu
app.post('/updateRank', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let userName = req.body;
  con.query(`UPDATE ranking SET userPoints = userPoints + 1 WHERE userName='${userName}' AND id=(SELECT MAX(id) FROM ranking WHERE userName='${userName}')`, function (err, result, fields) {
    if (err) throw err;
  });
})

//nowa runda
app.post('/newRound', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let data = req.body;
  var d = new Date();
  var time = d.toLocaleTimeString();
  con.query(`SELECT text FROM words ORDER BY RAND() LIMIT 1`, function (err, result, fields) {
    if (err) throw err;
    var newResult = result.map((result)=>result.text);
    global.globalWord = newResult; 
  })
  
    console.log(globalWord);
    con.query(`INSERT INTO round (roundNumber, roundWord, startTime, drawerName) VALUES ('1','${globalWord}','${d}','${data[0]}')`, function (err, result, fields) {
      if (err) throw err;
    })
  
  usersList = [];
})

//pobierz aktualne dane rundy
app.get('/roundData', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`SELECT * FROM round ORDER BY id DESC LIMIT 1`, function (err, result, fields) {
    if (err) throw err;
    let newResult = result.map((result)=>[result.roundNumber, result.roundWord, result.startTime, result.drawerName]);
    res.send(newResult);
  });
})

// reset rysowania
app.get('/reset', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`UPDATE paths SET isActive='0' WHERE isActive='1'`, function (err, result, fields) {
    if (err) throw err;
    console.log("Zresetowano rysunek!");
  });
  let resReset = true;
  res.end(JSON.stringify(resReset));
})

// reset chatu
app.get('/resetChat', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`UPDATE chat SET isActive='0' WHERE isActive='1'`, function (err, result, fields) {
    if (err) throw err;
    console.log("Zresetowano chat");
  });
  let resReset = true;
  res.end(JSON.stringify(resReset));
})

//nowa wiadomość chatu
app.post('/newMessage', function (req, res) {
  //to co wysyła klient do serwera przez axios
  let mess = req.body;
  con.query(`INSERT INTO chat (userID, userName, message, isActive) VALUES ('${mess[0]}','${mess[1]}','${mess[2]}','1')`, function (err, result, fields) {
    if (err) throw err;
  });
})

//wiadomości chatu
app.get('/chatMessages', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`SELECT * FROM chat ORDER BY id DESC LIMIT 20`, function (err, result, fields) {
    if (err) throw err;
    let newResult = result.map((result)=>[result.userName, result.message]);
    newResult = newResult.reverse();
    res.send(newResult);
  });
})

//tablica wiadomości które spełniają isActive = true
app.get('/chatActiveMessages', function (req, res) {
  //to co wysyła serwer do klienta przez fetch
  con.query(`SELECT * FROM chat WHERE isActive='1' ORDER BY id DESC LIMIT 10`, function (err, result, fields) {
    if (err) throw err;
    let newResult = result.map((result)=>[result.userID, result.userName, result.message]);
    newResult = newResult.reverse();
    res.send(newResult);
  });
})

// tutaj zapis do pliku
let paths = [];

app.get('/testAPI', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'application/json',
  });
  res.end(JSON.stringify(paths));
});

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
});
var sendVar = 0;
app.post('/testAPI', function(req, res) {
  const newPath = req.body;
  var str = JSON.stringify(newPath);

  con.query(`INSERT INTO paths (path, isActive) VALUES ('${str}','1')`, function (err, result, fields) {
    if (err) throw err;
    console.log(`wysłano(${sendVar})`)
    sendVar++;
  });
});

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
