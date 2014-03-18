var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
       userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
    }
});


var fs = require('fs'); 
phantom.cookiesEnabled = true;
 
function login(casper, username, password) {
  
  casper.start('http://login.rutracker.org/forum/login.php');
  
  casper.then(function() {
    this.fill('form#login-form', {
      login_username: username,
      login_password: password
    });
  });
 
  casper.thenClick('#login-form input[type="submit"]', function() {
    this.capture('login.png');
  });
}
 
function setCookies(){
    var cookies = JSON.stringify(phantom.cookies);    
    fs.write("cookies.txt", cookies, 644);
}

function getCookies(){
  var cookies = fs.read('cookies.txt');
  phantom.cookies = JSON.parse(cookies);
}

function getIndex(year) {
  var form = '#tr-form',
      submit = '#tr-form input[type="submit"]';
 
  var search_params = {
    'f[]': '124',
    'nm': year + ' sub',
    'o': '2',
    's': '1'
  };
 
  casper.thenOpen('http://rutracker.org/forum/tracker.php', function(){
    this.fill(form, search_params);
  });
 
  casper.thenClick(submit, function(){
    require('fs').write(year + ".html", this.getHTML(), "w");
    //.write(year + '.html', this.getPageContent());
  });
}
 
var loggedSelector = "#page_header b.med";
 
getCookies();
casper.start('http://rutracker.org', function() {
  casper.waitFor(function() {
    return this.exists('#logo img');
  }, function then() {
    var isLogged = this.exists(loggedSelector) && (this.fetchText(loggedSelector) == 'nahimka');
    this.echo('My login' + isLogged);
    if (isLogged) {
      this.capture('scr004.png');
      getIndex(1990);
    }
    else {
      login(casper, 'nahimka', '4uozz');

      casper.then(function(){
        this.capture('rutracker-logged.png');
        setCookies();
      });
    }
  });
});
 
casper.run();