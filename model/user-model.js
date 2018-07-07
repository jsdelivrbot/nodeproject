//Get db URL from process environment variable
const dbURL = process.env.DATABASE_URL;
const session = require('express-session');


const { Pool } = require('pg')
const pool = new Pool({
    connectionString: dbURL,
    ssl: true
});

var bcrypt = require('bcrypt');

function handleRegistration(req, res){
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
   
    bcrypt.hash(password, 10, function(err, hash) {
        pool.query('INSERT INTO users(firstname, lastname, useremail, userpassword) VALUES ($1, $2, $3, $4)', [firstName, lastName, email, hash], (err, results) => {
            if (err) {
                console.log(err);
            } else{
                console.log(results);
                res.render('pages/login');
            }
        });
    });
}

function handleLogin(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    console.log(email); 
    console.log(password);
    pool.query('SELECT userpassword, userid FROM users WHERE useremail = $1', [email], (err, results) => {
        if (err) {
            console.log(err);
        } else{
            console.log(results.rows[0]);
        }
        
        const hash = results.rows[0]['userpassword'];
        
        bcrypt.compare(password, hash, function(err, response) {
//            console.log(password);
//            console.log(hash);
            if (response == true) {
                console.log("Have some Bacon!");
                req.session.userid = results.rows[0]['userid'];
                req.session.userid;
            }else{
                console.log(err);
                console.log(response);
            }
            res.render('pages/index');
        });
    
    });
    
    
    
}
module.exports = {
    handleLogin: handleLogin,
    handleRegistration: handleRegistration
};