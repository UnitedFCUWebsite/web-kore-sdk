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


  function getUserId(){
    var params = new URLSearchParams(window.location.search);
    console.log(params.has('userId'));
    var t_userId = "";
    if(params.has('userId')){
      t_userId=params.get('userId');
      console.log(t_userId);
    }else{
      console.log(t_userId);
      t_userId= koreGenerateUUID();
    }
    console.log(t_userId);
   return t_userId;
}
function koreGenerateUUID() {
  var d = new Date().getTime();
  if (window.performance && typeof window.performance.now === "function") {
      d += performance.now(); //use high-precision timer if available
  }
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
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
    allowLocation: true,			      // set false, to deny sending location to server
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
    }
  };
 

  botOptions.koreAPIUrl = "https://bankassist.kore.ai/workbench/api";
  botOptions.brandingAPIUrl = botOptions.koreAPIUrl + '/workbench/sdkData?objectId=hamburgermenu&objectId=brandingwidgetdesktop';
  botOptions.JWTUrl = "https://mk2r2rmj21.execute-api.us-east-1.amazonaws.com/dev/users/sts";
  botOptions.userIdentity = getUserId();// Provide users email id here
  botOptions.botInfo = { name: "Mya", "_id": "st-009c0e1a-e3cc-5d35-b493-c7d332039690",customData:{"rtmType":"web", "brandingId":"st-21ae4413-5366-5621-85c8-08f0f5a3f906" }}; // bot name is case sensitive
  botOptions.clientId = "cs-bfb4310f-34fc-5da7-928d-667ef50fb058";
  botOptions.clientSecret ="7JOc+Qaa9GisGPEdq62lpU0mNqKFb+z+17tU1gHON0g=";
  botOptions.accountId = "65203af7391d718428c910f2";
  

console.log()
  KoreSDK.chatConfig = chatConfig
})(window.KoreSDK);