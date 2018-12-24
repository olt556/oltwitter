'usestrict';

let touch_position_h = 0;
let touch_prevent_flag = 0;
document.getElementById("timeline_panel").ontouchstart = (event)=>{
    if (touch_prevent_flag === 0){    
    }
    else{
        touch_position_h = event.changedTouches[0];
    }
}
document.getElementById("timeline_panel").ontouchmove = (event)=>{
    if (touch_prevent_flag === 0){
        event.preventDefault();
    }
    else{
    }
}
window.onload = (event)=>{
    let windowSize = new windowSizeFix(event.type);
    windowSize.reSize();
}
window.onresize = ()=>{  
    let windowSize = new windowSizeFix(event.type);
    windowSize.reSize();
}
class windowSizeFix{
    constructor(event){
        if(event === 'load' || 'resize'){
            this.reSize = ()=>{  
                let size_h = window.innerHeight;
                let size_w = window.innerWidth;
            
                if(size_h > size_w){
                    var element = document.getElementById("window_panel").style; 
                    element.height = size_h + 'px';
                    element.width = size_w + 'px';
            
                    var element = document.getElementById("headder_panel").style;
                    let headder_size_h = size_h*0.085;//0.2*0.5*0.2
                    element.height = headder_size_h + 'px';
                    element.width = size_w + 'px';
                    element.top = 0 + 'px';
            
                    var element = document.getElementById("btn_clean").style; 
                    let btncln_size_h = headder_size_h;//0.2*0.5*0.2
                    element.height = btncln_size_h*0.75 + 'px';
                    element.width = btncln_size_h*0.75 + 'px';
                    element.bottom = btncln_size_h*(0.1) + 'px';
                    element.right = btncln_size_h*(0.4) + 'px';
            
                    var element = document.getElementById("btn_tab").style; 
                    element.height = btncln_size_h*0.75 + 'px';
                    element.width = btncln_size_h*0.75 + 'px';
                    element.bottom = btncln_size_h*(0.1) + 'px';
                    element.left = btncln_size_h*(0.4) + 'px';
            
                    var element = document.getElementById("input_panel").style; 
                    let IPsize_h = size_h*0.14;
                    element.height = IPsize_h + 'px';
                    element.width = size_w + 'px';
                    element.bottom = 0 + 'px';
            
                    var element = document.getElementById("timeline_panel").style; 
                    let TLsize_h = size_h - IPsize_h - headder_size_h;
                    element.height = TLsize_h + 'px';
                    element.width = size_w + 'px';
                    element.bottom = size_h - TLsize_h - headder_size_h + 'px';
            
                    var element = document.getElementById("btn_sample").style; 
                    let btn02_size_h = size_h*0.12;
                    element.height = btn02_size_h*0.85 + 'px';
                    element.width = btn02_size_h*0.85+ 'px';
                    element.bottom = btn02_size_h*(0.25/2.5) + 'px';
                    element.right = btn02_size_h*(0.25) + 'px';
            
                    var element = document.getElementById("textInput_area").style;
                    let textarea_size_h = size_h*0.12;
                    element.height = textarea_size_h*0.75 + 'px';
                    element.width = size_w - btn02_size_h*0.85 - btn02_size_h*(0.25)*3  + 'px';
                    element.bottom = textarea_size_h*(0.25/1.5) + 'px';
                    element.right = btn02_size_h*0.85+btn02_size_h*(0.25)*2 + 'px';
                    element.max_height = textarea_size_h*0.75 + 'px';
                    element.max_width = size_w*0.675 + 'px';
            
                } else if(size_h < size_w){
                    var element = document.getElementById("window_panel").style; 
                    element.height = size_h + 'px';
                    element.width = size_w + 'px';
            
                    var element = document.getElementById("headder_panel").style;
                    let headder_size_h = 0;
                    element.height = headder_size_h + 'px';
                    element.width = size_w + 'px';
                    element.top = 0 + 'px';
            
                    var element = document.getElementById("input_panel").style; 
                    let IPsize_h = size_h*0.215;
                    element.height = IPsize_h + 'px';
                    element.width = size_w + 'px';
                    element.bottom = 0 + 'px';
            
                    var element = document.getElementById("timeline_panel").style;    
                    let TLsize_h = size_h - IPsize_h - headder_size_h;
                    element.height = TLsize_h + 'px';
                    element.width = size_w + 'px';
                    element.bottom = size_h - TLsize_h - headder_size_h + 'px';
                        
                    var element = document.getElementById("btn_sample").style; 
                    let btn01_size_h = size_h*0.2;
                    element.height = btn01_size_h*0.85 + 'px';
                    element.width = btn01_size_h*0.85 + 'px';
                    element.bottom = btn01_size_h*(0.25/2.75) + 'px';
                    element.right = btn01_size_h*(0.25) + 'px';
            
                    var element = document.getElementById("btn_clean").style; 
                    let btncln_size_h = size_h*0.085;
                    element.height = btncln_size_h*0 + 'px';
                    element.width = size_w*0 + 'px';
                    element.bottom = btncln_size_h*(0.075) + 'px';
                    element.right = btncln_size_h*(0.4) + 'px';
            
                    var element = document.getElementById("btn_tab").style; 
                    let btntab_size_h = size_h*0.085;
                    element.height = btntab_size_h*0 + 'px';
                    element.width = size_w*0 + 'px';
                    element.bottom = btntab_size_h*(0.075) + 'px';
                    element.left = btntab_size_h*(0.4) + 'px';
            
                    var element = document.getElementById("textInput_area").style;
                    let textarea_size_h = size_h*0.2;
                    element.height = textarea_size_h*0.75 + 'px';
                    element.width = size_w - btn01_size_h*(0.25)*3 - btn01_size_h*0.85 + 'px';
                    element.bottom = textarea_size_h*(0.25/2) + 'px';
                    element.right = btn01_size_h*(0.25)*2+btn01_size_h*0.85 + 'px';
                    element.max_height = textarea_size_h*0.75 + 'px';
                    element.max_width = size_w*0.675 + 'px';
                }
            };
        }
    }
}
let tab_push = ()=>{
       // getTwitterTL();
       // setTimeout(1000, object_make(localStorage.getItem("MyTL_tw0")));
}
let sendButtonPush = ()=>{
    var element = document.getElementById("textInput_area");
    let send_text = element.value;
    if(element.value!==null && element.value!=false){
        console.log(send_text);
        object_make(send_text);
        element.value=null;
    }
    else if(localStorage.getItem("oauth_verifier")===null){
        getTokenKeys("request_token");
        return;
    }
    setTimeout(SendTweets(send_text, 800));
}
let getButtonPush = ()=>{
    getTwitterTL();
    setTimeout(()=>{

    }, 500);
}
let count_onclick_btnSample = 0;
let messageLast_containerSizeHeight = [];
let object_make = (text)=>{  

    let TLsize_h = document.getElementById("timeline_panel").height; 
    let TLsize_w = document.getElementById("timeline_panel").width;
    var str_tmp = 0 + '';
    if(count_onclick_btnSample > 0){
        str_tmp = TLsize_h + messageLast_containerSizeHeight[count_onclick_btnSample];
    }
    else {
        var str_tmp_s;
        str_tmp_s = str_tmp;
    }
    let object = document.createElement('div');  
    let object_s = document.getElementById("obj");

    object_s.innerHTML = [
        '<div id="message_container">'
        + '</div>'
            + '<div id = "message_0" >'
            + '<p>'+ text +'</p>'
            + '</div>' 
         + '</div>'
        + '</div>'
    ].join("");

    object_s.append(object);

    var element = document.getElementById("message_container");
    var element1 = document.getElementById("message_0");

    messageLast_containerSizeHeight.splice(count_onclick_btnSample+1, 0, str_tmp);
    count_onclick_btnSample = count_onclick_btnSample + 1;  
}
let clean_localStr = ()=>{
    localStorage.clear(); 
}