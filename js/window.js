'usestrict';

const dateObj = new Date();
const countShowTweets = (num = parseInt(localStorage.getItem("count_show_tweets"))) => {
    if (num === null) return 0;
    return num;
}

const objectMake = (tweetDataLists) => {
    for (let key = 0; key < tweetDataLists.length; key++) {
        let tmpObj = [
            '<li class="media ' + countShowTweets() + '">' +
                '<div style="display: flex;">' +
                    '<div class="media__pull__left">' +
                        '<img src="' + tweetDataLists[key].user.profile_image_url + '" alt="" style="width:100%; height:100%; border-radius: 100%">' +
                    '</div>' +
                    '<strong class="media__text--success">' + tweetDataLists[key].user.name + '<br>' + '@' + tweetDataLists[key].user.screen_name + '</strong>' +
                '</div>' +
                '<div class="media__body">' +
                '<p class="media__body__text">' +
                    tweetDataLists[key].text +
                '</p>' +
                '<span class="media__text__muted">' +
                    '<small class="text__muted--text"> '+
                        tweetDataLists[key].created_at +
                    '</small>' +
                '</span>' +
            '</div>' +
            '</li>'
        ];
        document.querySelector(".timeline__media").innerHTML += tmpObj;
        localStorage.setItem("count_show_tweets", countShowTweets() + 1);
    }
}

const tabButtonPush = () => {
    if (localStorage.getItem("init_date") === null) {
        getTwitterTL();
        localStorage.setItem("init_date", dateObj.getMinutes());
    } else if (dateObj.getMinutes() - localStorage.getItem("init_date") >= 1 || dateObj.getMinutes() - localStorage.getItem("init_date") === -59) {
        getTwitterTL();
        localStorage.setItem("init_date", dateObj.getMinutes());
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.querySelector(".header__btn--tab").addEventListener('click', () => {
        setTimeout(tabButtonPush(), 100)
    });
    document.querySelector(".header__btn--clean").addEventListener('click', () => {
        let elmlist = document.querySelectorAll(".media");
        elmlist.forEach((data) => {
            console.log(data);
            data.remove();
        });
        localStorage.setItem("count_show_tweets", 0);
    });
    document.querySelector(".footer__btn--post").addEventListener('click', () => {
        setTimeout(() => {
            let element = document.querySelector(".footer__text--input");
            let sendText = element.value;
            if(element.value !== null && element.value != false){
                console.log(sendText);
                element.value = null;
            } else if (localStorage.getItem("oauth_verifier") === null) {
                getTokenKeys("request_token");
                return;
            }
            setTimeout(sendTweets(sendText, 800));
        }, 300);
    });
});