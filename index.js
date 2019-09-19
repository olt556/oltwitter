const crypto = require('crypto');
const http  = require('http');
const qs  = require('querystring');

const requestUrl = 'https://api.twitter.com/oauth/request_token';
const requestUrl2 = 'https://api.twitter.com/oauth/access_token';
const callbackUrl = 'http://test.com/';
const consumerKey = "";
const consumerSecret = "";
const keyOfSign = encodeURIComponent(consumerSecret) + "&";

let resRequest = {};
let resAccess = {};
let dataToken = {};
let paramsRequestToken = {};
let paramsAccessToken = {};
let resData = "";
let oauthToken = "";
let oauthTokenSecret = "";
let ipAddress = "1";
let ipTime = 0;

const httpServer = new http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://test.jp');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    if (ipTime !== 0 && (Date.now() - ipTime) >= 50000 && ipAddress !== "1") {
        ipTime = 0;
        ipAddress = "1";
    }
    if (req.method === 'POST') {
        req.on('data', (data) => {
            const getTokenMethods = new RequestMethods();

            resData = data + "";
            paramsRequestToken = {
                oauth_callback: callbackUrl,
                oauth_consumer_key: consumerKey,
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: (() => {
                    const date = new Date();
                    return Math.floor(date.getTime() / 1000);
                })(),
                oauth_nonce: (() => {
                    const date = new Date();
                    return date.getTime();
                })(),
                oauth_version: '1.0'
            };
            if (resData === "request_token") {
                if (ipAddress === getIP(req) && (Date.now() - ipTime) < 50000) {
                    console.log("same IP  && time out!!");
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.write("error!");
                    res.end();
                } else if (ipTime === 0) {
                    ipTime = Date.now();
                    ipAddress = getIP(req);
                    console.log("get request_token");
                    getTokenMethods.getRequestToken();
                }
            } else if (resData) { //判定考える
                console.log("get access_token");
                getTokenMethods.getAccessToken(resData);
            }
        });
    }
}).listen(process.env.PORT || 2000);
console.log('Server running at ' + process.env.PORT);

const getIP = (req) => {
    if (req.headers['x-forwarded-for']) {
        return req.headers['x-forwarded-for'];
    }
    return 0;
}

class RequestTokenMethods {
    constructor() {
        this.getRequestToken = (params) => {
            Object.keys(params).forEach(item => {
                params[item] = encodeURIComponent(params[item]);
            });

            let requestParams = Object.keys(params).map(item => {
                return item + '=' + params[item];
            });
            requestParams.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
            requestParams = encodeURIComponent(requestParams.join('&'));

            let dataOfSign = (() => {
                return encodeURIComponent('POST') + '&' + encodeURIComponent(requestUrl) + '&' + requestParams;
            })();

            let signature = (() => {
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
            request.post(options, (error, response, body) => {
                //return body;
                resRequest = qs.parse(body);
            });
        };
        this.getAccessToken = (params) => {
            Object.keys(params).forEach(item => {
                params[item] = encodeURIComponent(params[item]);
            });

            let requestParams = Object.keys(params).map(item => {
                return item + '=' + params[item];
            });

            requestParams.sort((a, b) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
            requestParams = encodeURIComponent(requestParams.join('&'));
            let dataOfSign = (() => {
                return encodeURIComponent('POST') + '&' + encodeURIComponent(requestUrl2) + '&' + requestParams;
            })();

            let signature = (() => {
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
            request.post(options, (error, response, body) => {
                resAccess = qs.parse(body);
            });
        };
    }
}
class RequestMethods{
    constructer(res) {
        const requestMethod = RequestTokenMethods;
        this.reauestToken = () => {
            requestMethod.getRequestToken(paramsRequestToken);
            setTimeout(() => {
                //次のリクエストのためにグローバル変数に保存
                oauthToken = resRequest.oauth_token;
                oauthTokenSecret = resRequest.oauth_token_secret;
                dataToken = {
                    oauth_token: resRequest.oauth_token,
                    oauth_token_secret: resRequest.oauth_token_secret,
                    oauth_uri: "https://api.twitter.com/oauth/authorize?oauth_token=" + encodeURIComponent(oauth_token),
                    consumer_key: consumerKey,
                    consumer_secret: consumerSecret
                };
            }, 500);
            req.on('end', () => {
                setTimeout(() => {
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.write(JSON.stringify(dataToken));
                    res.end()
                }, 1000);
            });
        }
        this.getAccessToken = (resData) => {
            resData = JSON.parse(resData);
            paramsAccessToken = {
                oauth_consumer_key: consumerKey,
                oauth_token: resData.oauth_token,
                oauth_signature_method: 'HMAC-SHA1',
                oauth_timestamp: (() => {
                    const date = new Date();
                    return Math.floor(date.getTime() / 1000);
                })(),
                oauth_verifier: resData.oauth_verifier,
                oauth_nonce: (() => {
                    const date = new Date();
                    return date.getTime();
                })(),
                oauth_version: '1.0',
            };
            requestMethod.getAccessToken(paramsAccessToken);
            setTimeout(() => {
                oauthToken = resAccess.oauth_token;
                oauthTokenSecret = resAccess.oauth_token_secret;
            }, 500);

            req.on('end', () => {
                setTimeout(() => {
                    dataToken = {};
                    requestParams = {};
                    res.writeHead(200, {
                        "Content-Type": "application/json"
                    });
                    res.write(JSON.stringify(resAccess));
                    res.end();
                }, 1000);
            });
        }
    }
}