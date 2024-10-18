(function (KoreSDK) {

  var KoreSDK = KoreSDK || {};

  var botOptions = {};
  botOptions.logLevel = 'debug';
  // botOptions.koreAPIUrl = "";

  botOptions.koreSpeechAPIUrl = "";//deprecated
  //botOptions.bearer = "bearer xyz-------------------";
  //botOptions.ttsSocketUrl = '';//deprecated
  botOptions.koreAnonymousFn = koreAnonymousFn;
  botOptions.recorderWorkerPath = '../libs/recorderWorker.js';

  // To modify the web socket url use the following option
  // botOptions.reWriteSocketURL = {
  //     protocol: 'PROTOCOL_TO_BE_REWRITTEN',
  //     hostname: 'HOSTNAME_TO_BE_REWRITTEN',
  //     port: 'PORT_TO_BE_REWRITTEN'
  // };

  var chatConfig = {
    botOptions: botOptions,
    allowIframe: false, 			      // set true, opens authentication links in popup window, default value is "false"
    isSendButton: false, 			      // set true, to show send button below the compose bar
    isTTSEnabled: false,			      // set true, to hide speaker icon
    ttsInterface: 'webapi',         // webapi or awspolly , where default is webapi
    isSpeechEnabled: true,			    // set true, to hide mic icon
    allowGoogleSpeech: true,		    // set true, to use Google speech engine instead KORE.AI engine.This feature requires valid Google speech API key. (Place it in 'web-kore-sdk/libs/speech/key.js')
    allowLocation: false,			      // set false, to deny sending location to server
    loadHistory: false,				      // set true to load recent chat history
    messageHistoryLimit: 10,		    // set limit to load recent chat history
    autoEnableSpeechAndTTS: false, 	// set true, to use talkType voice keyboard.
    graphLib: "d3",				          // set google, to render google charts.This feature requires loader.js file which is available in google charts documentation.
    googleMapsAPIKey: "",
    minimizeMode: true,             // set true, to show chatwindow in minized mode 
    supportDelayedMessages: false,    // enable to add support for renderDelay in message nodes which will help to render messages with delay from UI       
    isFromFinastra: false,
    pickersConfig: {
      showDatePickerIcon: false,           //set true to show datePicker icon
      showDateRangePickerIcon: false,      //set true to show dateRangePicker icon
      showClockPickerIcon: false,          //set true to show clockPicker icon
      showTaskMenuPickerIcon: true,        //set true to show TaskMenu Template icon
      showradioOptionMenuPickerIcon: false //set true to show Radio Option Template icon
    },
    maxReconnectionAPIAttempts: 5,  // Number of retries on api failure,
    syncMessages: {
        onReconnect: {
            enable: false,  // Set true to sync messages on Reconnect
            batchSize: 10   // To configure the number of messages to fetch
        }
    }
  };

  

  if(chatConfig.isFromFinastra){
    botOptions.JWTUrl = "https://staging-bankassist.korebots.com/finastra-wrapper/token";
    botOptions.brandingAPIUrl = "";
    botOptions.userIdentity = '';// Provide users email id here
    botOptions.botInfo = { name: "Banking Assist", "_id": "",customData:{"rtmType":"web"}}; // bot name is case sensitive
    botOptions.accountId = "5fad6c9a694b34300513832e";  

    botOptions.botInfo.customData.accessToken = getCookie("accessToken");
    botOptions.botInfo.customData.source = getCookie("source");
    botOptions.botInfo.customData.tenantId = getCookie("tenantId");
    botOptions.botInfo.customData.uniqueUserId = getCookie("uniqueUserId");
  } 
  else {
    
    // botOptions.koreAPIUrl = "https://bankassist.kore.ai/workbench/api";
    // botOptions.brandingAPIUrl = botOptions.koreAPIUrl + '/workbench/sdkData?objectId=hamburgermenu&objectId=brandingwidgetdesktop';
    // botOptions.JWTUrl = "https://pars5e5beeeoc2gwucqyxpppbm0acdhr.lambda-url.us-east-1.on.aws/visifi-sts";
    // botOptions.userIdentity = '';// Provide users email id here
    // botOptions.botInfo = { name: "Mya", "_id": "st-f07347f1-d880-5bc3-b1cf-728214ccc813",customData:{"rtmType":"web","brandingId":"st-14e59eb1-6dd3-5602-8296-e6928aff1324", "environment":"test"}}; // bot name is case sensitive
    // botOptions.accountId = "65f001c224df7166b7b5181b";
    // botOptions.universalBotId ="st-14e59eb1-6dd3-5602-8296-e6928aff1324";
    // botOptions.tenant="UFCU_Test"


    
    botOptions.koreAPIUrl = "https://bankassist.kore.ai/workbench/api";
    botOptions.brandingAPIUrl = botOptions.koreAPIUrl + '/workbench/sdkData?objectId=hamburgermenu&objectId=brandingwidgetdesktop';
    botOptions.JWTUrl = "https://integrations-finastra.kore.ai/visifi-sts";
    botOptions.userIdentity = '';// Provide users email id here
    botOptions.botInfo = { name: "Mya", "_id": "st-009c0e1a-e3cc-5d35-b493-c7d332039690",customData:{rtmType: "web", brandingId: "st-2d0bc0d0-75e7-5d10-8864-712de89c65d9", environment: "test"}}; // bot name is case sensitive
    botOptions.accountId = "65203af7391d718428c910f2";
    botOptions.universalBotId ="st-2d0bc0d0-75e7-5d10-8864-712de89c65d9";
    botOptions.tenant="UFCU"

 }
  // window._BAMya.accountId
  // window._BAMya.botId
  // window._BAMya.clientId
  // window._BAMya.clientSecret

  function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  /* 
  allowGoogleSpeech will use Google cloud service api.
  Google speech key is required for all browsers except chrome.
  On Windows 10, Microsoft Edge will support speech recognization.
  */

  KoreSDK.chatConfig = chatConfig
})(window.KoreSDK);

