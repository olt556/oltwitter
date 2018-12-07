const request = require('request'),
      crypto = require('crypto');
const http = require('http');
      https = require('https');
      fs   = require('fs');
      url = require('url');
      path = require('path');
const qs = require('querystring');

const mime = {
  ".html": "text/html",
  ".css":  "text/css",
  ".js":   "application/javascript",
  ".png":  "image/png",
  ".jpg":  "image/jpeg"
};

const requestUrl = 'https://api.twitter.com/oauth/request_token';
const requestUrl2 = 'https://api.twitter.com/oauth/access_token';
const callbackUrl = 'http://xxx.co.jp';
const consumer_key = "";
const consumer_secret = "";
const keyOfSign = encodeURIComponent(consumer_secret) + "&";

let tmp_body = {};
let tmp_body2 = {};
let data_token = {};
let params_requestToken = {};
let params_accessToken = {};
let res_data;

let oauth_token;
let oauth_token_secret;

const http_server = new http.createServer((req, res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://xxx.co.jp');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');

  if(req.method==='POST') {
    req.on('data', (data)=>{
      console.log(data+"");
      res_data = data + "";
      params_requestToken = {
        oauth_callback: callbackUrl,
        oauth_consumer_key: consumer_key,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: (()=>{
            const date = new Date();
            return Math.floor( date.getTime() / 1000 );
        })(),
        oauth_nonce: (()=>{
            const date = new Date();
            return date.getTime();
        })(),
        oauth_version: '1.0'
      };

      if(res_data==='request_token'){
        requestToken()
      } else { //判定考える
        accessToken(res_data);
      }
    });
    let requestToken = ()=>{
      console.log("test1");
      let data_req = new RequestMethodClass(res_data);
      data_req.getRequestToken(params_requestToken);
      console.log(res_data);
      setTimeout(()=>{
        console.log(tmp_body.oauth_token);
        console.log(tmp_body.oauth_token_secret);
        //次のリクエストのためにグローバル変数に保存
        oauth_token=tmp_body.oauth_token;
        oauth_token_secret=tmp_body.oauth_token_secret;
        data_token = {
          oauth_token: tmp_body.oauth_token,
          oauth_token_secret: tmp_body.oauth_token_secret,
          oauth_uri: "https://api.twitter.com/oauth/authorize?oauth_token="+encodeURIComponent(oauth_token),
          consumer_key: consumer_key,
          consumer_secret: consumer_secret
        };
      }, 500);
      req.on("end", ()=>{
        setTimeout(()=>{
          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(data_token));
          res.end()
        }, 1000);
      });
    } 
    let accessToken = (res_data)=>{
      res_data=JSON.parse(res_data);
      params_accessToken = {
        oauth_consumer_key: consumer_key,
        oauth_token: res_data.oauth_token,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: (()=>{
          const date = new Date();
          return Math.floor( date.getTime() / 1000 );
        })(),
        oauth_verifier: res_data.oauth_varifier,
        oauth_nonce: (()=>{
          const date = new Date();
          return date.getTime();
        })(),
        oauth_version: '1.0',
      };
      let data_req = new RequestMethodClass('access_token');
      data_req.getAccessToken(params_accessToken);
      setTimeout(()=>{
        oauth_token = tmp_body2.oauth_token;
        oauth_token_secret = tmp_body2.oauth_token_secret;
        console.log(oauth_token);
        console.log(oauth_token_secret);
      }, 500);
      req.on("end", ()=>{
        setTimeout(()=>{
          console.log(tmp_body2);
          //res.setHeader('form', data_token);
          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(tmp_body2));
          res.end();
        }, 1000);
      });
    }
  }
}).listen(process.env.PORT || 2000);
console.log('Server running at '+ process.env.PORT);

let RequestMethodClass = function(req){
  if(!(this instanceof RequestMethodClass)) {
      return new RequestMethodClass(req);
  }
  if(req === 'request_token'){
    this.getRequestToken = (params)=>{
        Object.keys(params).forEach(item => {
          params[item] = encodeURIComponent(params[item]);
        });

        let requestParams = Object.keys(params).map(item => {
          return item + '=' + params[item];
        });
        requestParams.sort((a,b) => {
          if( a < b ) return -1;
          if( a > b ) return 1;
          return 0;
        });
        requestParams = encodeURIComponent(requestParams.join('&'));
      
        let dataOfSign = (()=>{
          return encodeURIComponent('POST') + '&' + encodeURIComponent(requestUrl) + '&' + requestParams;
        })();
      
        let signature = (()=>{
          return crypto.createHmac('sha1', keyOfSign).update(dataOfSign).digest('base64');
        })();
      
        params['oauth_signature'] = encodeURIComponent(signature);
      
        let headerParams = Object.keys(params).map(item => {
            return item + '=' + params[item];
        });
      
        headerParams = headerParams.join(',');
      
        let header = {
            'Authorization': 'OAuth ' + headerParams
        };
      
        //オプションを定義
        let options = {
            url: requestUrl,
            headers: header,
        };
        //リクエスト送信
        request.post(options, (error, response, body)=>{
            //return body;
            tmp_body = qs.parse(body);
            console.log(tmp_body);
        });
    };
  } else if(req ==='access_token'){
    this.getAccessToken = (params)=>{
      Object.keys(params).forEach(item => {
        params[item] = encodeURIComponent(params[item]);
      });

      let requestParams = Object.keys(params).map(item => {
        return item + '=' + params[item];
      });

      requestParams.sort((a,b) => {
        if( a < b ) return -1;
        if( a > b ) return 1;
        return 0;
      });
      requestParams = encodeURIComponent(requestParams.join('&'));
      let dataOfSign = (()=>{
        return encodeURIComponent('POST') + '&' + encodeURIComponent(requestUrl2) + '&' + requestParams;
      })();
        
      let signature = (()=>{
        return crypto.createHmac('sha1', keyOfSign).update(dataOfSign).digest('base64');
      })();
        
      params['oauth_signature'] = encodeURIComponent(signature);  
      let headerParams = Object.keys(params).map(item => {
        return item + '=' + params[item];
      });
        
      headerParams = headerParams.join(','); 
      let header = {
          'Authorization': 'OAuth ' + headerParams
      };  
      //オプションを定義
      let options = {
        url: requestUrl2,
        headers: header,
      };
      //リクエスト送信
      request.post(options, (error, response, body)=>{
        //return body;
        tmp_body2 = qs.parse(body);
        console.log(tmp_body2);
      });
    };
  }
};