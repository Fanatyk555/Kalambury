var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "kalambury"
});

var sql = "SELECT path FROM paths WHERE isActive='1' ORDER BY id ASC";
con.connect(function(err) {
    if (err) throw err;
    console.log("MySQL Connected!");
    let i = 1;   
    setInterval(() => {
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            const newResult = result.map((result)=>result.path);
            global.globalNewResult = newResult;
            router.get("/", function(req,res,next){
                res.send(globalNewResult);
                // console.log(globalNewResult);
            })         
            module.exports = router;
        });
        // console.log(`wysłano sql(${i})`)
        // i++;
    }, 2000);
});

module.exports = router;