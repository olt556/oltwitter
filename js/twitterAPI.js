let getTwitterTL = ()=>{
    let options = {
        method: "GET",
        apiURL: "https://api.twitter.com/1.1/statuses/home_timeline.json",
        count: 10,
        consumerKey: localStorage.getItem("consumer_key"),
        consumerSecret: localStorage.getItem("consumer_secret"),
        accessToken: localStorage.getItem("oauth_token"),
        tokenSecret: localStorage.getItem("oauth_token_secret")
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
            callback: "http://xxx.xxx.com"
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
    })
}
let SendTweets = (tweets_txt)=>{
    let options = {
        method: "POST",
        apiURL: "https://api.twitter.com/1.1/statuses/update.json",
        consumerKey: localStorage.getItem("consumer_key"),
        consumerSecret: localStorage.getItem("consumer_secret"),
        accessToken: localStorage.getItem("oauth_token"),
        tokenSecret: localStorage.getItem("oauth_token_secret"),
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
            callback: "http://xxx.xxx.com"
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
let tweetsData = [];
let data2 = [];
let tweetList = [];
let cbname1 = (tweetsData)=>{
    let count = 0;
    while(count<10){
        tweetList.push(tweetsData[count].text);
        count = count + 1;
    }
    localStorage.setItem("myTimeLine", tweetList);
}
let cbname2 = (data2)=>{
    JSON.stringify(data2);
}