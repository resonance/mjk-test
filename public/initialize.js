/* Sample JavaScript file added with ScriptTag resource. 
This sample file is meant to teach best practices.
Your app will load jQuery if it's not defined. 
Your app will load jQuery if jQuery is defined but is too old, e.g. < 1.7. 
Your app does not change the definition of $ or jQuery outside the app. 
Example: if a Shopify theme uses jQuery 1.4.2, both of these statements run in the console will still return '1.4.2'
once the app is installed, even if the app uses jQuery 1.9.1:
jQuery.fn.jquery => "1.4.2" 
$.fn.jquery -> "1.4.2"
*/

/* Using a self-executing anonymous function - (function(){})(); - so that all variables and functions defined within 
aren’t available to the outside world. */

(function(){
  
/* Load Script function we may need to load jQuery from the Google's CDN */
/* That code is world-reknown. */
/* One source: http://snipplr.com/view/18756/loadscript/ */

var loadScript = function(url, callback){
 
  var script = document.createElement("script");
  script.type = "text/javascript";

  // If the browser is Internet Explorer.
  if (script.readyState){ 
    script.onreadystatechange = function(){
      if (script.readyState == "loaded" || script.readyState == "complete"){
        script.onreadystatechange = null;
        callback();
      }
    };
  // For any other browser.
  } else {
    script.onload = function(){
      callback();
    };
  }

  script.src = url;
  document.getElementsByTagName("head")[0].appendChild(script);
    
};

/* This is my app's JavaScript */
var myAppJavaScript = function($){
  // $ in this scope references the jQuery object we'll use.
  // Don't use jQuery, or jQuery191, use the dollar sign.
  // Do this and do that, using $.


    // if not on the Payment method page, exit
    if (!$(".section.section--payment-method").length ) {
	    return;
    }

	/*
	*  Desc: Force cross domain iframes to size to content.
	*  Requires: iframeResizer.contentWindow.min.js to be loaded into the target frame.
	*  Copyright: (c) 2016 David J. Bradshaw - dave@bradshaw.net
	*  License: MIT
	*/
	!function sizeToContent(a){"use strict";function b(b,c,d){"addEventListener"in a?b.addEventListener(c,d,!1):"attachEvent"in a&&b.attachEvent("on"+c,d)}function c(b,c,d){"removeEventListener"in a?b.removeEventListener(c,d,!1):"detachEvent"in a&&b.detachEvent("on"+c,d)}function d(){var b,c=["moz","webkit","o","ms"];for(b=0;b<c.length&&!N;b+=1)N=a[c[b]+"RequestAnimationFrame"];N||h("setup","RequestAnimationFrame not supported")}function e(b){var c="Host page: "+b;return a.top!==a.self&&(c=a.parentIFrame&&a.parentIFrame.getId?a.parentIFrame.getId()+": "+b:"Nested host page: "+b),c}function f(a){return K+"["+e(a)+"]"}function g(a){return P[a]?P[a].log:G}function h(a,b){k("log",a,b,g(a))}function i(a,b){k("info",a,b,g(a))}function j(a,b){k("warn",a,b,!0)}function k(b,c,d,e){!0===e&&"object"==typeof a.console&&console[b](f(c),d)}function l(d){function e(){function a(){s(V),p(W)}g("Height"),g("Width"),t(a,V,"init")}function f(){var a=U.substr(L).split(":");return{iframe:P[a[0]].iframe,id:a[0],height:a[1],width:a[2],type:a[3]}}function g(a){var b=Number(P[W]["max"+a]),c=Number(P[W]["min"+a]),d=a.toLowerCase(),e=Number(V[d]);h(W,"Checking "+d+" is in range "+c+"-"+b),c>e&&(e=c,h(W,"Set "+d+" to min value")),e>b&&(e=b,h(W,"Set "+d+" to max value")),V[d]=""+e}function k(){function a(){function a(){var a=0,d=!1;for(h(W,"Checking connection is from allowed list of origins: "+c);a<c.length;a++)if(c[a]===b){d=!0;break}return d}function d(){var a=P[W].remoteHost;return h(W,"Checking connection is from: "+a),b===a}return c.constructor===Array?a():d()}var b=d.origin,c=P[W].checkOrigin;if(c&&""+b!="null"&&!a())throw new Error("Unexpected message received from: "+b+" for "+V.iframe.id+". Message was: "+d.data+". This error can be disabled by setting the checkOrigin: false option or by providing of array of trusted domains.");return!0}function l(){return K===(""+U).substr(0,L)&&U.substr(L).split(":")[0]in P}function w(){var a=V.type in{"true":1,"false":1,undefined:1};return a&&h(W,"Ignoring init message from meta parent page"),a}function y(a){return U.substr(U.indexOf(":")+J+a)}function z(a){h(W,"MessageCallback passed: {iframe: "+V.iframe.id+", message: "+a+"}"),N("messageCallback",{iframe:V.iframe,message:JSON.parse(a)}),h(W,"--")}function A(){var b=document.body.getBoundingClientRect(),c=V.iframe.getBoundingClientRect();return JSON.stringify({iframeHeight:c.height,iframeWidth:c.width,clientHeight:Math.max(document.documentElement.clientHeight,a.innerHeight||0),clientWidth:Math.max(document.documentElement.clientWidth,a.innerWidth||0),offsetTop:parseInt(c.top-b.top,10),offsetLeft:parseInt(c.left-b.left,10),scrollTop:a.pageYOffset,scrollLeft:a.pageXOffset})}function B(a,b){function c(){u("Send Page Info","pageInfo:"+A(),a,b)}x(c,32)}function C(){function d(b,c){function d(){P[g]?B(P[g].iframe,g):e()}["scroll","resize"].forEach(function(e){h(g,b+e+" listener for sendPageInfo"),c(a,e,d)})}function e(){d("Remove ",c)}function f(){d("Add ",b)}var g=W;f(),P[g].stopPageInfo=e}function D(){P[W]&&P[W].stopPageInfo&&(P[W].stopPageInfo(),delete P[W].stopPageInfo)}function E(){var a=!0;return null===V.iframe&&(j(W,"IFrame ("+V.id+") not found"),a=!1),a}function F(a){var b=a.getBoundingClientRect();return o(W),{x:Math.floor(Number(b.left)+Number(M.x)),y:Math.floor(Number(b.top)+Number(M.y))}}function G(b){function c(){M=g,H(),h(W,"--")}function d(){return{x:Number(V.width)+f.x,y:Number(V.height)+f.y}}function e(){a.parentIFrame?a.parentIFrame["scrollTo"+(b?"Offset":"")](g.x,g.y):j(W,"Unable to scroll to requested position, window.parentIFrame not found")}var f=b?F(V.iframe):{x:0,y:0},g=d();h(W,"Reposition requested from iFrame (offset x:"+f.x+" y:"+f.y+")"),a.top!==a.self?e():c()}function H(){!1!==N("scrollCallback",M)?p(W):q()}function I(b){function c(){var a=F(g);h(W,"Moving to in page link (#"+e+") at x: "+a.x+" y: "+a.y),M={x:a.x,y:a.y},H(),h(W,"--")}function d(){a.parentIFrame?a.parentIFrame.moveToAnchor(e):h(W,"In page link #"+e+" not found and window.parentIFrame not found")}var e=b.split("#")[1]||"",f=decodeURIComponent(e),g=document.getElementById(f)||document.getElementsByName(f)[0];g?c():a.top!==a.self?d():h(W,"In page link #"+e+" not found")}function N(a,b){return m(W,a,b)}function O(){switch(P[W].firstRun&&T(),V.type){case"close":n(V.iframe);break;case"message":z(y(6));break;case"scrollTo":G(!1);break;case"scrollToOffset":G(!0);break;case"pageInfo":B(P[W].iframe,W),C();break;case"pageInfoStop":D();break;case"inPageLink":I(y(9));break;case"reset":r(V);break;case"init":e(),N("initCallback",V.iframe),N("resizedCallback",V);break;default:e(),N("resizedCallback",V)}}function Q(a){var b=!0;return P[a]||(b=!1,j(V.type+" No settings for "+a+". Message was: "+U)),b}function S(){for(var a in P)u("iFrame requested init",v(a),document.getElementById(a),a)}function T(){P[W].firstRun=!1}var U=d.data,V={},W=null;"[iFrameResizerChild]Ready"===U?S():l()?(V=f(),W=R=V.id,!w()&&Q(W)&&(h(W,"Received: "+U),E()&&k()&&O())):i(W,"Ignored: "+U)}function m(a,b,c){var d=null,e=null;if(P[a]){if(d=P[a][b],"function"!=typeof d)throw new TypeError(b+" on iFrame["+a+"] is not a function");e=d(c)}return e}function n(a){var b=a.id;h(b,"Removing iFrame: "+b),a.parentNode.removeChild(a),m(b,"closedCallback",b),h(b,"--"),delete P[b]}function o(b){null===M&&(M={x:void 0!==a.pageXOffset?a.pageXOffset:document.documentElement.scrollLeft,y:void 0!==a.pageYOffset?a.pageYOffset:document.documentElement.scrollTop},h(b,"Get page position: "+M.x+","+M.y))}function p(b){null!==M&&(a.scrollTo(M.x,M.y),h(b,"Set page position: "+M.x+","+M.y),q())}function q(){M=null}function r(a){function b(){s(a),u("reset","reset",a.iframe,a.id)}h(a.id,"Size reset requested by "+("init"===a.type?"host page":"iFrame")),o(a.id),t(b,a,"reset")}function s(a){function b(b){a.iframe.style[b]=a[b]+"px",h(a.id,"IFrame ("+e+") "+b+" set to "+a[b]+"px")}function c(b){H||"0"!==a[b]||(H=!0,h(e,"Hidden iFrame detected, creating visibility listener"),y())}function d(a){b(a),c(a)}var e=a.iframe.id;P[e]&&(P[e].sizeHeight&&d("height"),P[e].sizeWidth&&d("width"))}function t(a,b,c){c!==b.type&&N?(h(b.id,"Requesting animation frame"),N(a)):a()}function u(a,b,c,d){function e(){var e=P[d].targetOrigin;h(d,"["+a+"] Sending msg to iframe["+d+"] ("+b+") targetOrigin: "+e),c.contentWindow.postMessage(K+b,e)}function f(){i(d,"["+a+"] IFrame("+d+") not found"),P[d]&&delete P[d]}function g(){c&&"contentWindow"in c&&null!==c.contentWindow?e():f()}d=d||c.id,P[d]&&g()}function v(a){return a+":"+P[a].bodyMarginV1+":"+P[a].sizeWidth+":"+P[a].log+":"+P[a].interval+":"+P[a].enablePublicMethods+":"+P[a].autoResize+":"+P[a].bodyMargin+":"+P[a].heightCalculationMethod+":"+P[a].bodyBackground+":"+P[a].bodyPadding+":"+P[a].tolerance+":"+P[a].inPageLinks+":"+P[a].resizeFrom+":"+P[a].widthCalculationMethod}function w(a,c){function d(){function b(b){1/0!==P[w][b]&&0!==P[w][b]&&(a.style[b]=P[w][b]+"px",h(w,"Set "+b+" = "+P[w][b]+"px"))}function c(a){if(P[w]["min"+a]>P[w]["max"+a])throw new Error("Value for min"+a+" can not be greater than max"+a)}c("Height"),c("Width"),b("maxHeight"),b("minHeight"),b("maxWidth"),b("minWidth")}function e(){var a=c&&c.id||S.id+F++;return null!==document.getElementById(a)&&(a+=F++),a}function f(b){return R=b,""===b&&(a.id=b=e(),G=(c||{}).log,R=b,h(b,"Added missing iframe ID: "+b+" ("+a.src+")")),b}function g(){h(w,"IFrame scrolling "+(P[w].scrolling?"enabled":"disabled")+" for "+w),a.style.overflow=!1===P[w].scrolling?"hidden":"auto",a.scrolling=!1===P[w].scrolling?"no":"yes"}function i(){("number"==typeof P[w].bodyMargin||"0"===P[w].bodyMargin)&&(P[w].bodyMarginV1=P[w].bodyMargin,P[w].bodyMargin=""+P[w].bodyMargin+"px")}function k(){var b=P[w].firstRun,c=P[w].heightCalculationMethod in O;!b&&c&&r({iframe:a,height:0,width:0,type:"init"})}function l(){Function.prototype.bind&&(P[w].iframe.iFrameResizer={close:n.bind(null,P[w].iframe),resize:u.bind(null,"Window resize","resize",P[w].iframe),moveToAnchor:function(a){u("Move to anchor","inPageLink:"+a,P[w].iframe,w)},sendMessage:function(a){a=JSON.stringify(a),u("Send Message","message:"+a,P[w].iframe,w)}})}function m(c){function d(){u("iFrame.onload",c,a),k()}b(a,"load",d),u("init",c,a)}function o(a){if("object"!=typeof a)throw new TypeError("Options is not an object")}function p(a){for(var b in S)S.hasOwnProperty(b)&&(P[w][b]=a.hasOwnProperty(b)?a[b]:S[b])}function q(a){return""===a||"file://"===a?"*":a}function s(b){b=b||{},P[w]={firstRun:!0,iframe:a,remoteHost:a.src.split("/").slice(0,3).join("/")},o(b),p(b),P[w].targetOrigin=!0===P[w].checkOrigin?q(P[w].remoteHost):"*"}function t(){return w in P&&"iFrameResizer"in a}var w=f(a.id);t()?j(w,"Ignored iFrame, already setup."):(s(c),g(),d(),i(),m(v(w)),l())}function x(a,b){null===Q&&(Q=setTimeout(function(){Q=null,a()},b))}function y(){function b(){function a(a){function b(b){return"0px"===P[a].iframe.style[b]}function c(a){return null!==a.offsetParent}c(P[a].iframe)&&(b("height")||b("width"))&&u("Visibility change","resize",P[a].iframe,a)}for(var b in P)a(b)}function c(a){h("window","Mutation observed: "+a[0].target+" "+a[0].type),x(b,16)}function d(){var a=document.querySelector("body"),b={attributes:!0,attributeOldValue:!1,characterData:!0,characterDataOldValue:!1,childList:!0,subtree:!0},d=new e(c);d.observe(a,b)}var e=a.MutationObserver||a.WebKitMutationObserver;e&&d()}function z(a){function b(){B("Window "+a,"resize")}h("window","Trigger event: "+a),x(b,16)}function A(){function a(){B("Tab Visable","resize")}"hidden"!==document.visibilityState&&(h("document","Trigger event: Visiblity change"),x(a,16))}function B(a,b){function c(a){return"parent"===P[a].resizeFrom&&P[a].autoResize&&!P[a].firstRun}for(var d in P)c(d)&&u(a,b,document.getElementById(d),d)}function C(){b(a,"message",l),b(a,"resize",function(){z("resize")}),b(document,"visibilitychange",A),b(document,"-webkit-visibilitychange",A),b(a,"focusin",function(){z("focus")}),b(a,"focus",function(){z("focus")})}function D(){function a(a,c){function d(){if(!c.tagName)throw new TypeError("Object is not a valid DOM element");if("IFRAME"!==c.tagName.toUpperCase())throw new TypeError("Expected <IFRAME> tag, found <"+c.tagName+">")}c&&(d(),w(c,a),b.push(c))}var b;return d(),C(),function(c,d){switch(b=[],typeof d){case"undefined":case"string":Array.prototype.forEach.call(document.querySelectorAll(d||"iframe"),a.bind(void 0,c));break;case"object":a(c,d);break;default:throw new TypeError("Unexpected data type ("+typeof d+")")}return b}}function E(a){a.fn.iFrameResize=function(a){return this.filter("iframe").each(function(b,c){w(c,a)}).end()}}var F=0,G=!1,H=!1,I="message",J=I.length,K="[iFrameSizer]",L=K.length,M=null,N=a.requestAnimationFrame,O={max:1,scroll:1,bodyScroll:1,documentElementScroll:1},P={},Q=null,R="Host Page",S={autoResize:!0,bodyBackground:null,bodyMargin:null,bodyMarginV1:8,bodyPadding:null,checkOrigin:!0,inPageLinks:!1,enablePublicMethods:!0,heightCalculationMethod:"bodyOffset",id:"iFrameResizer",interval:32,log:!1,maxHeight:1/0,maxWidth:1/0,minHeight:0,minWidth:0,resizeFrom:"parent",scrolling:!1,sizeHeight:!0,sizeWidth:!1,tolerance:0,widthCalculationMethod:"scroll",closedCallback:function(){},initCallback:function(){},messageCallback:function(){j("MessageCallback function not defined")},resizedCallback:function(){},scrollCallback:function(){return!0}};a.jQuery&&E(jQuery),"function"==typeof define&&define.amd?define([],D):"object"==typeof module&&"object"==typeof module.exports?module.exports=D():a.iFrameResize=a.iFrameResize||D()}(window||{});
	//# sourceMappingURL=iframeResizer.map
	
	
    // if our iframe is not on the page, fetch it
    if (!$("#howhearddropdown").length ) {
      GetMainBody();
    }

    // if promo code submitted, reload
	$("button.field__input-btn").click(function(){
	  location.reload();
	});


    // if promo code removed, reload
    $("button.applied-reduction-code__clear-button").click(function() {
      location.reload();
    });

  
};

/* If jQuery has not yet been loaded or if it has but it's too old for our needs,
we will load jQuery from the Google CDN, and when it's fully loaded, we will run
our app's JavaScript. Set your own limits here, the sample's code below uses 1.7
as the minimum version we are ready to use, and if the jQuery is older, we load 1.9. */
if ((typeof jQuery === 'undefined') || (parseFloat(jQuery.fn.jquery) < 1.9)) {
  loadScript('//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', function(){
    jQuery191 = jQuery.noConflict(true);
    myAppJavaScript(jQuery191);
  });
} else {
  myAppJavaScript(jQuery);
}

})();




function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
		else {
			return "";
		}
    }
 };





function GetMainBody() {

    // read {{checkout.email}} value from our div
    var custEmail = $('#resonance').text();

    if (custEmail) {
	
        // parse checkout uri to get the store's id
		var pathSplit = window.location.pathname.split( '/' );
		var storeId = pathSplit[1].toString();

		var iframeUrl = 'https://how-heard.herokuapp.com/dropdown?storeId=' + storeId + '&email=' + custEmail;

	    $('.section.section--optional').append('<iframe id="howhearddropdown" width="0" height="0" style="border:none;" src="' + iframeUrl +'"></iframe>');

    }
	
 };





function ReloadInitialize() {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://how-heard.herokuapp.com/initialize.js"; 
    document.getElementsByTagName("head")[0].appendChild(script);
    return false;
 };


