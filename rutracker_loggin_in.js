var casper = require('casper').create({   
    verbose: true, 
    logLevel: 'debug',
    pageSettings: {
         loadImages:  false,         // The WebPage instance used by Casper will
         loadPlugins: false,         // use these settings
         userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});

// print out all the messages in the headless browser context
casper.on('remote.message', function(msg) {
    this.echo('remote message caught: ' + msg);
});

// print out all the messages in the headless browser context
casper.on("page.error", function(msg, trace) {
    this.echo("Page Error: " + msg, "ERROR");
});


var url = 'http://login.rutracker.org/forum/login.php';
var fs = require('fs');
var login = 'your_login';
var password = 'your_pass';

phantom.cookiesEnabled = true;

casper.start(url, function() {
   
//   console.log("page loaded!");
//   this.echo(this.getTitle());   
//   this.test.assertExists('form#login_form', 'form is found');
//   this.test.assertExists('.pad_2 > form:nth-child(2) > input:nth-child(2)', 'input email is found');
//   this.test.assertExists('.pad_2 > form:nth-child(2) > input:nth-child(3)', 'input pass is found');
//   this.test.assertExists('.pad_2 > form:nth-child(2) > input:nth-child(4)', 'submit is found');

//   this.capture('screen0.jpg');

   this.evaluate(function(username, password) {
    document.querySelector('.pad_2 > form:nth-child(2) > input:nth-child(2)').value = username;
    document.querySelector('.pad_2 > form:nth-child(2) > input:nth-child(3)').value = password;
    document.querySelector('.pad_2 > form:nth-child(2) > input:nth-child(4)').click();
}, login, password);

   this.capture('screen1.jpg');
   this.click('.pad_2 > form:nth-child(2) > input:nth-child(4)');
});

casper.then(function()
{
    fs.write("test.html", this.getHTML(), "w");
});

casper.then(function(){
    this.capture('login_after_reload_before.png');
    console.log(this.getCurrentUrl());
});

casper.then(function(){
    this.reload();
});

casper.then(function(){
    this.capture('login_after_reload_after.png');
    console.log(this.getCurrentUrl());
});


casper.then(function() {
    this.evaluateOrDie(function() {
        return /message sent/.test(document.body.innerText);
    }, 'sending message failed');
});

casper.run(function() {
    this.echo('message sent').exit();
});

