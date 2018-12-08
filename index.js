const request = require('request'),
      crypto = require('crypto');
const http = require('http');
const qs = require('querystring');

const requestUrl = 'https://api.twitter.com/oauth/request_token';
const requestUrl2 = 'https://api.twitter.com/oauth/access_token';
const callbackUrl = 'http://oldera.html.xdomain.jp';
const consumer_key = "nxdeClA3xBe6VuNT4xG4EsRF8";
const consumer_secret = "L5V9EVqWAECcsT0WxXs5gkNpuxN4wKPKwYQ1RLOiaKb3iAu6Qg";
const keyOfSign = encodeURIComponent(consumer_secret) + "&";

let resRequest = {};
let resAccess = {};
let data_token = {};
let paramsRequestToken = {};
let paramsAccessToken = {};
let res_data;

let oauth_token;
let ipAddress = '1';
let ipTime = 0;

const http_server = new http.createServer((req, res)=>{
  res.setHeader('Access-Control-Allow-Origin', 'http://oldera.html.xdomain.jp');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  if(ipTime!==0 && (Date.now()-ipTime)>=50000 && ipAddress !== '1'){
    ipTime = 0;
    ipAddress = '1';
  }
  if(req.method==='POST') {
    req.on('data', (data)=>{
      res_data = data + "";
      paramsRequestToken = {
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
        if(ipAddress === getIP(req) && (Date.now()-ipTime)<50000){
            console.log("same IP  && time out!!");
            res.writeHead(200, {"Content-Type": "application/json"});
            res.write("error!");
            res.end();
        } else if(ipTime === 0) {
          ipTime = Date.now();
          ipAddress = getIP(req);
          console.log("get request_token");
          requestToken();
        }
      } else { //判定考える
        console.log("get access_token");
        accessToken(res_data);
      }
    });

    let requestToken = ()=>{
      let data_req = new RequestMethodClass(res_data);
      data_req.getRequestToken(paramsRequestToken);
      setTimeout(()=>{
        //次のリクエストのためにグローバル変数に保存
        oauth_token=resRequest.oauth_token;
        oauth_token_secret=resRequest.oauth_token_secret;
        data_token = {
          oauth_token: resRequest.oauth_token,
          oauth_token_secret: resRequest.oauth_token_secret,
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
      paramsAccessToken = {
        oauth_consumer_key: consumer_key,
        oauth_token: res_data.oauth_token,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: (()=>{
          const date = new Date();
          return Math.floor( date.getTime() / 1000 );
        })(),
        oauth_verifier: res_data.oauth_verifier,
        oauth_nonce: (()=>{
          const date = new Date();
          return date.getTime();
        })(),
        oauth_version: '1.0',
      };
      let data_req = new RequestMethodClass('access_token');
      data_req.getAccessToken(paramsAccessToken);
      setTimeout(()=>{
        oauth_token = resAccess.oauth_token;
        oauth_token_secret = resAccess.oauth_token_secret;
      }, 500);
      req.on("end", ()=>{
        setTimeout(()=>{
          data_token = {};
          requestParams = {};
          res.writeHead(200, {"Content-Type": "application/json"});
          res.write(JSON.stringify(resAccess));
          res.end();
        }, 1000);
      });
    }
  }
}).listen(process.env.PORT || 2000);
console.log('Server running at '+ process.env.PORT);

let getIP = (req)=>{
  if (req.headers['x-forwarded-for']) {
     return req.headers['x-forwarded-for'];
  }
  return '0';
};

class RequestMethodClass {
  constructor(req) {
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
            resRequest = qs.parse(body);
        });
      };
    } else if(req === 'access_token') {
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
          resAccess = qs.parse(body);
        });
      };
    }
  }
}