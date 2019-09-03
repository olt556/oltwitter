if((window.location.search+"").match(/oauth_verifier/)){
    let getQueryVariable = (variable)=>{
        let query = window.location.search.substring(1);
        let varbs = query.split("&");
        for (let i=0;i<varbs.length;i++) {
            let pair = varbs[i].split("=");
            if (pair[0] === variable) {
                return pair[1];
            }
        }
    }
    let twitterOAuth = (options)=>{
        let request = new XMLHttpRequest;
            request.onload = function (event) {
               if (request.readyState === 4) {
                  if (request.status === 200) {
                     console.log(request.statusText); // success
                     console.log(request.response);
                     let data_json = JSON.parse(request.response);
                     localStorage.setItem("oauth_token_secret", data_json.oauth_token_secret);
                     localStorage.setItem("oauth_token", data_json.oauth_token);
                     location.href='http://xxx.xxx.com';
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
    let oauth_verifier = getQueryVariable("oauth_verifier");
    let oauth_token = getQueryVariable("oauth_token");
    localStorage.setItem("oauth_verifier", oauth_verifier);
    localStorage.setItem("oauth_token", oauth_token);
    
    let options = {
        oauth_verifier: localStorage.getItem("oauth_verifier"),
        oauth_token: localStorage.getItem("oauth_token")
    };
    setTimeout(twitterOAuth(JSON.stringify(options)), 1000);
}

let getTokenKeys = (req_str)=>{
    let request = new XMLHttpRequest();
    if (req_str === 'request_token'){
         //イベントハンドラ設定
         request.onload = (event)=>{
             if (request.readyState === 4) {
                 if (request.status === 200) {
                     console.log(request.statusText); // success
                     console.log(request.response);
                     initTwitterOAuth(request.response);
                 } else {
                     console.log(request.statusText); // error
                 }
             }
         };
         request.onerror = (event)=>{
             console.log(event.type); // error
         };
         request.open("POST", 'https://oltorosy.herokuapp.com/', true);
         XMLHttpRequest.responseType = 'json';
         request.send(req_str);
         console.log(req_str);
     } else if (req_str === 'oauth_token'){
         //イベントハンドラ設定
        request.onload = (event)=>{
            if (request.readyState === 4) {
                if (request.status === 200) {
                    console.log(request.statusText); // success
                    console.log(request.response);
                    twitterOAuth(request.response);
                } else {
                    console.log(request.statusText); // error
                }
            }
        };
        request.onerror = (event)=>{
            console.log(event.type); // error
        };
        request.open("POST", 'https://otorosy.herokuapp.com/', true);
        XMLHttpRequest.responseType = 'json';
        request.send(req_str); 
        console.log(req_str);
    }
}
let initTwitterOAuth = (dataToken)=>{
    let dataTokens = JSON.parse(dataToken);
    console.log("dataToken: "+ JSON.stringify(dataTokens));
    localStorage.setItem("consumer_key", dataTokens.consumer_key);
    localStorage.setItem("consumer_secret", dataTokens.consumer_secret);
    location.href=(dataTokens.oauth_uri);
}