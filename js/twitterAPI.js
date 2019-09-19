let tweetDateList = [];

const getTwitterTL = () => {
    let options = {
        method: "GET",
        apiURL: "https://api.twitter.com/1.1/statuses/home_timeline.json",
        count: 199,
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
            callback: "cbFunc"
        }
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    let url = OAuth.addToURL(message.action, message.parameters);
    $.ajax({
        type: options.method,
        url: url,
        dataType: "jsonp",
        jsonp: false,
        cache: true
    });
}
const sendTweets = (tweets_txt) => {
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
            callback: "http://test.jp"
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

function cbFunc(tweetDataList){
    console.log(tweetDataList);
    localStorage.setItem("tweets_data_lists", JSON.stringify(tweetDataList));
    objectMake(tweetDataList);
}