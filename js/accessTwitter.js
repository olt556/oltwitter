var data1 = [];
var data2 = [];
function twitter_init(data_token1){
    console.log("test1: "+ data_token1);
    var data_token = JSON.parse(data_token1);
    console.log("test2: "+ JSON.stringify(data_token));
    localStorage.setItem("consumer_key", data_token.consumer_key);
    localStorage.setItem("consumer_secret", data_token.consumer_secret);
    location.href=(data_token.oauth_uri);
}
if((window.location.search+"").match(/oauth_verifier/)){
    var value1 = getQueryVariable("oauth_verifier");
    var value2 = getQueryVariable("oauth_token");
    localStorage.setItem("oauth_verifier", value1);
    localStorage.setItem("oauth_token", value2);
    console.log(value1);
    var options = {
        oauth_verifier: localStorage.getItem("oauth_verifier")+"",
        oauth_token: localStorage.getItem("oauth_token")+""
    };
    setTimeout(twitter_auth(JSON.stringify(options)), 1000);
}
function twitter_auth(options){
   let request = new XMLHttpRequest;
       request.onload = function (event) {
          if (request.readyState === 4) {
             if (request.status === 200) {
                console.log(request.statusText); // success
                console.log(request.response);
                let data_json = JSON.parse(request.response);
                localStorage.setItem("oauth_token_secret", data_json.oauth_token_secret);
                localStorage.setItem("oauth_token", data_json.oauth_token);
                location.href='http://xxx.co.jp';
            } else {
                console.log(request.statusText); // error
            }
       }
   }
   request.onerror = function (event) {
      console.log(event.type); // error
   }
   request.open("POST", "https://oltorosy.herokuapp.com/");
   XMLHttpRequest.responseType = 'json';
   request.send(options);
   console.log();
}
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
}

function getTwitterTL(){
    let options = {
        method: "GET",
        apiURL: "https://api.twitter.com/1.1/statuses/home_timeline.json",
        count: 10,
        consumerKey: localStorage.getItem("consumer_key"),
        consumerSecret: localStorage.getItem("consumer_secret"),
        accessToken:  localStorage.getItem("oauth_token"),
        tokenSecret:   localStorage.getItem("oauth_token_secret")
    };
    let accessor = {
        consumerSecret: options.consumerSecret,
        tokenSecret: options.tokenSecret
    };
    let message = {
        method: options.method,
        action: options.apiURL,      
        parameters: {
            count: options.count,
            oauth_version: "1.0",
            oauth_signature_method: "HMAC-SHA1",
            oauth_consumer_key: options.consumerKey,
            oauth_token: options.accessToken,
            callback: "cbname1"
        }
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var url = OAuth.addToURL(message.action, message.parameters);
    $.ajax({
        type: options.method,
        url: url,
        dataType: "jsonp",
        jsonp: false,
        cache: true
    });
}
function SendTwitter(tweets_txt){
    let options = {
        method: "POST",
        apiURL: "https://api.twitter.com/1.1/statuses/update.json",
        consumerKey: localStorage.getItem("consumer_key"),
        consumerSecret: localStorage.getItem("consumer_secret"),
        accessToken:  localStorage.getItem("oauth_token"),
        tokenSecret:   localStorage.getItem("oauth_token_secret"),
    };   
    let accessor = {
        consumerSecret: options.consumerSecret,
        tokenSecret: options.tokenSecret
    };
    let message = {
        method: options.method,
        action: options.apiURL,
        parameters: {
            oauth_version: "1.0" ,
            oauth_signature_method:"HMAC-SHA1" ,
            oauth_consumer_key: options.consumerKey ,
            oauth_token: options.accessToken,
            status: tweets_txt + "",
            callback: "cbname2"
        }      
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    let url = OAuth.addToURL(message.action, message.parameters);
    $.ajax({
        type: options.method,
        url: url,
    });
}
var tweetsList = [];
function cbname1(data1){
    var count=0;
    while(count<10){
        tweetsList.push(data1[count].text);
        var str_key = 'MyTL_tw' + count;
        localStorage.setItem(str_key ,tweetsList[count]);　
        count = count + 1;
    }
}
function cbname2(data2){
    JSON.stringify(data2);
}