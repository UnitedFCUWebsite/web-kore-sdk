(function ($) {

    var _hash = (location.href.split("#")[1] || "");
    // var _hash = "eyJqd3QiOiJleUowZVhBaU9pSktWMVFpTENKaGJHY2lPaUpJVXpJMU5pSjkuZXlKcFlYUWlPakUyTVRBME16RTJNRGswTmpjc0ltVjRjQ0k2TVRZeE1EUXpNVFkyT1RRMk55d2lZWFZrSWpvaUlpd2lhWE56SWpvaVkzTXROMkUyTkdZelpUVXRZelkxTXkwMVpXUTNMVGt4T1RjdE9EUmpNR1UzTjJOak1qRmxJaXdpYzNWaUlqb2lZMkV5T1RJNFltSmxNV1kxTVRCaE9ERXhaRFU0Wm1Gak9XTXhZalprTmpNME1pSXNJbWx6UVc1dmJubHRiM1Z6SWpwbVlXeHpaWDAuOGRib3JwTEhWTm9BUE5OSVhzN1VhQ2hqNF9yS1o3bU1fRFdQTUxxa0txcyIsImJvdEluZm8iOnsibmFtZSI6IkJhbmtpbmcgQXNzaXN0IiwiX2lkIjoic3QtY2RlZmNlMGYtOWVlZC01NGM1LWIzZDctM2MxYjJmODNiOGVjIn0sImtvcmVBUElVcmwiOiJodHRwczovL2Jhbmtpbmdhc3Npc3RhbnQtcWEua29yZS5haTo0NDMvIiwiY2hhbm5lbCI6InJ0bSJ9"
    var hashObj = {};
    // if (_hash) {
    //     try {
    //         _hash = _hash.substr(0, _hash.length);
    //         hashObj = atob(_hash);
    //         //parses the JSON string to object
    //         hashObj = JSON.parse(hashObj);
    //     } catch (error) {
    //         alert("Something went wrong. Please try again.." + error);
    //     }

    // }

    $(document).ready(function () {

        function koreGenerateUUID() {
            console.info("generating UUID");
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

        function getQueryStringValue(key) {
            return window.location.search.replace(new RegExp("^(?:.*[&\\?]" + key.replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1");
        }

        function assertion(options, callback) {
            //console.log(options.botInfo.customData.tenantId);
            if (hashObj && hashObj.jwt) {
                options.assertion = hashObj.jwt;
                options.handleError = koreBot.showError;
                options.chatHistory = koreBot.chatHistory;
                options.botDetails = koreBot.botDetails;
                callback(null, options);
            } else if(chatConfig.isFromFinastra){
                var jsonData = {
                    "tenantId": options.botInfo.customData.tenantId,
                    "uniqueUserId": options.botInfo.customData.uniqueUserId,
                };
                $.ajax({
                    url: options.JWTUrl,
                    type: 'post',
                    data: jsonData,
                    dataType: 'json',
                    success: function (data) {
                        options.botInfo.chatBot = data.botInfo.name;
                        chatConfig.botOptions.botInfo.name = data.botInfo.name;
                        options.botInfo.taskBotId = data.botInfo._id;
                        chatConfig.botOptions.botInfo._id = data.botInfo._id;
                        options.koreAPIUrl = data.koreAPIUrl;
                        options.brandingAPIUrl = data.koreAPIUrl + 'workbench/sdkData?objectId=hamburgermenu&objectId=brandingwidgetdesktop';
                        options.assertion = data.jwt;
                        options.uniqueUserId = data.uniqueUserId;
                        options.handleError = koreBot.showError;
                        options.chatHistory = koreBot.chatHistory;
                        // options.botDetails = koreBot.botDetails(data);
                        callback(null, options);
                        setTimeout(function () {
                            CheckRefreshToken(options);
                        }, 2000);
                        
                    },
                    error: function (err) {
                        koreBot.showError(err.responseText);
                    }
                });
            } else {
                var jsonData = {
                    "clientId": options.clientId,
                    "clientSecret": options.clientSecret,
                    "identity": uuid,
                    "aud": "",
                    "isAnonymous": false,
                    "tenant":options.tenant
                };
                $.ajax({
                    url: options.JWTUrl,
                    type: 'post',
                    data: jsonData,
                    dataType: 'json',
                    success: function (data) {
                        options.assertion = data.jwt;
                        options.handleError = koreBot.showError;
                        options.chatHistory = koreBot.chatHistory;
                        callback(null, options);
                    },
                    error: function (err) {
                        koreBot.showError(err.responseText);
                    }
                });
            }
        }

        function getBrandingInformation(options) {
            $.ajax({
                url: this.koreAPIUrl + '/workbench/sdkData?objectId=hamburgermenu&objectId=brandingwidgetdesktop',
                headers: {
                    'tenantId': chatConfig.botOptions.accountId,
                    'Authorization': "bearer " + options.authorization.accessToken,
                    'Accept-Language': 'en_US',
                    'Accepts-version': '1',
                    'botId': chatConfig.botOptions.universalBotId,
                    'state': 'published'
                },
                type: 'get',
                dataType: 'json',
                success: function (data) {
                    options.botDetails = koreBot.botDetails(data[1].brandingwidgetdesktop);
                    chatConfig.botOptions.hamburgermenuData = data[0].hamburgermenu;
                    if (koreBot && koreBot.initToken) {
                        koreBot.initToken(options);
                    }
                },
                error: function (err) {
                    console.log(err);
                }
            });
        }

        function CheckRefreshToken(options){
            var jsonData = {
                "userId": window.jwtDetails.userInfo.userId,
                "uniqueUserId": options.uniqueUserId
            };
            $.ajax({
                url: "https://staging-bankassist.korebots.com/finastra-wrapper/uniqueUser",
                type: 'post',
                data: jsonData,
                dataType: 'json',
                success: function (data) {
                    if (koreBot && koreBot.initToken) {
                        koreBot.initToken(options);
                    }
                }
            });
        }
        
        var korecookie = localStorage.getItem("korecom");
        var uuid = getQueryStringValue('uid');
        if (uuid) {
            console.log(uuid);
        } else {
            uuid = koreGenerateUUID();
        }
        localStorage.setItem("korecom", uuid);
        var chatConfig = window.KoreSDK.chatConfig;
        KoreSDK.resetSSN=function(){
            
        }
        chatConfig.botOptions.assertionFn = assertion;
        chatConfig.botOptions.jwtgrantSuccessCB = getBrandingInformation;

        if (hashObj && hashObj.botInfo) {
            chatConfig.botOptions.botInfo = hashObj.botInfo;
        }

        if (hashObj && hashObj.koreAPIUrl) {
            chatConfig.botOptions.koreAPIUrl = hashObj.koreAPIUrl + '/api/';
        }

        // if (hashObj.brand && hashObj.brand.headerTitle) {
        //     chatConfig.chatTitleOverride = hashObj.brand.headerTitle;
        // }

        var koreBot;
        koreBot = koreBotChat();
         koreBot.show(chatConfig);
         KoreSDK.destroyChatBot = function(){
            koreBot.destroy();
            KoreSDK.chatConfig.isChatBotOpened = false;
            }
        $('.openChatWindow').click(function () {
            koreBot.show(chatConfig);
        });
        var botOptionsInformation = {};
        botOptionsInformation['env'] = '';
        var botOptionsArray = ['botId', 'clientId', 'clientSecret', 'accountId','triggerValue'];
        $('.submit').click(function () {
            var isValidForm = true;
            for (var i = 0; i < botOptionsArray.length; i++) {
                if (!$('#' + botOptionsArray[i]).val().length && (botOptionsArray[i] !=='triggerValue')) {
                    isValidForm = false;
                    if ($('#' + botOptionsArray[i] + 'Error').hasClass('display-none')) {
                        $('#' + botOptionsArray[i] + 'Error').removeClass('display-none');
                        $('#' + botOptionsArray[i] + 'Error').addClass('display-block');
                    }
                } else if ($('#' + botOptionsArray[i]).val().length) {
                    botOptionsInformation[botOptionsArray[i]] = $('#' + botOptionsArray[i]).val();
                    if ($('#' + botOptionsArray[i] + 'Error').hasClass('display-block')) {
                        $('#' + botOptionsArray[i] + 'Error').removeClass('display-block');
                        $('#' + botOptionsArray[i] + 'Error').addClass('display-none');
                    }
                }
            }
            if (isValidForm) {
                if (!botOptionsInformation['env'].length) {
                    window.alert('Please select environment');
                } else {
                    chatConfig['botOptions']['botInfo']['_id'] = botOptionsInformation['botId'];
                    chatConfig['botOptions']['accountId'] = botOptionsInformation['accountId'];
                    chatConfig['botOptions']['clientId'] = botOptionsInformation['clientId'];
                    chatConfig['botOptions']['clientSecret'] = botOptionsInformation['clientSecret'];
                    if(botOptionsInformation && botOptionsInformation['triggerValue']){
                        chatConfig['botOptions']['botInfo']['customData']['trigger'] = botOptionsInformation['triggerValue'];
                    }
                    if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'dev') {
                        chatConfig['botOptions']['koreAPIUrl'] = "https://bankassist-dev.kore.ai/workbench/api";
                    }
                    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'qa') {
                        chatConfig['botOptions']['koreAPIUrl'] = "https://bankingassistant-qa.kore.ai/workbench/api";
                    }
                    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'demo') {
                        chatConfig['botOptions']['koreAPIUrl'] = "https://bankingassistant-demo.kore.ai/workbench/api";
                    }
                    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'bnkstg') {
                        chatConfig['botOptions']['koreAPIUrl'] = "https://bankingassistant-stg.kore.ai/workbench/api";
                    }
                    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'prod') {
                        chatConfig['botOptions']['koreAPIUrl'] = "https://bankassist.kore.ai/workbench/api";
                    }
                    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'platstg') {
                        chatConfig['botOptions']['koreAPIUrl'] = " https://staging-workbench-external.korebots.com/workbench/api";
                    }
		    else if (botOptionsInformation['env'].length && botOptionsInformation['env'] == 'pncLocalOnPrem') {
                        chatConfig['botOptions']['koreAPIUrl'] = " https://installer-393-use1-wb.korebots.com/workbench/api";
                    }
                    $('.bot-details-submission-form').addClass('display-none');
                    koreBot = koreBotChat();
                    koreBot.show(chatConfig);
                }
            }
        });


        function envdropdownChanges() {
            if ($('.env-information').hasClass('display-none')) {
                $('.env-information').removeClass('display-none');
                $('.env-information').addClass('display-block');
            } else if ($('.env-information').hasClass('display-block')) {
                $('.env-information').removeClass('display-block');
                $('.env-information').addClass('display-none');
            }
        }
        $('.env-selection').click(function (e) {
            envdropdownChanges();
        });

        $('#dev').click(function (e) {
            botOptionsInformation['env'] = 'dev';
            $('#env').val('Dev');
            envdropdownChanges();
        });
        $('#qa').click(function (e) {
            botOptionsInformation['env'] = 'qa';
            $('#env').val('QA');
            envdropdownChanges();
        });
        $('#bnkstg').click(function (e) {
            botOptionsInformation['env'] = 'bnkstg';
            $('#env').val('Bank Assist STAGING');
            envdropdownChanges();
        });
        $('#platstg').click(function (e) {
            botOptionsInformation['env'] = 'platstg';
            $('#env').val('PLAT STAGING');
            envdropdownChanges();
        });
        $('#demo').click(function (e) {
            botOptionsInformation['env'] = 'demo';
            $('#env').val('DEMO');
            envdropdownChanges();
        });
        $('#prod').click(function (e) {
            botOptionsInformation['env'] = 'prod';
            $('#env').val('Prod');
            envdropdownChanges();
        });
	$('#pncLocalOnPrem').click(function (e) {
            botOptionsInformation['env'] = 'pncLocalOnPrem';
            $('#env').val('pncLocalOnPrem');
            envdropdownChanges();
        });
    });

})(jQuery || (window.KoreSDK && window.KoreSDK.dependencies && window.KoreSDK.dependencies.jQuery));
