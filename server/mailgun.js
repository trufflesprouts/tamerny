/*
  This server side JS file is main file that takes care of all 
  emails being sent either for verification or for other reasons.
*/



// SECTION I: Startup Methods

Meteor.startup(function() {  
    Meteor.methods({
      // sendEmail: function (mailFields) {
      //   check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);
      //   this.unblock();

      //   Meteor.Mailgun.send({
      //       to: mailFields.to,
      //       from: mailFields.from,
      //       subject: mailFields.subject,
      //       text: mailFields.text,
      //       html: mailFields.html
      //   });
      // },

      sendForgotPassLink: function(email){
        var options = {};
        options.email = email;

        Accounts.emailTemplates.siteName = "Tamerny";
        Accounts.emailTemplates.from     = "Tamerny Accounts <accounts@tamerny.com>";
        Accounts.emailTemplates.subject  = "[Tamerny] Reset your password";

        Accounts.emailTemplates.resetPassword.html = function(user, url) {

          var emailAddress   = email
          var urlWithoutHash = url.replace( '#/', '' ).replace('tamerneyapp.herokuapp', 'tamerny')
          var supportEmail   = "help@tamerny.com"
          var mainText = "To reset your password, click on the button below."
          var supportText = "If you did not request to reset your password, please ignore this email. If you feel something is wrong, please contact our support team: " + supportEmail
          var button = "Reset Password"

          return verificationEmailTemplate (urlWithoutHash, mainText, supportText, button);
        };

        var user = Accounts.findUserByEmail(email)

        if (user != null){
          Accounts.sendResetPasswordEmail(user._id, email);
          Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast',
            ['Perfect, a link was sent to your email to reset your password !', 4000], function(error, result) {
            });
        } else {
          Meteor.ClientCall.apply(Meteor.userId(), 'materializeToast',
            ["The email you entered is incorrect", 4000], function(error, result) {
            });
        }

      },
      isEmailValid: function(address) {

        var result = HTTP.get('https://api.mailgun.net/v3/address/validate', {
          auth: 'api:pubkey-80156cf58a2f3d876d8780785e49fbfe',
          params: {address: address.trim()}
        });

        console.log("result.statusCode")
        console.log(result.statusCode)
        console.log("result.data.is_valid")
        console.log(result.data.is_valid)

        if (result.statusCode === 200) {
          // is_valid is the boolean we are looking for
          return result.data.is_valid;
        } else {
          // the api request failed (maybe the service is down)
          // consider giving the user the benefit of the doubt and return true
          return true;
        }
      },
      sendVerificationLink: function(userId, email, err) {

        Accounts.emailTemplates.siteName = "Tamerny";
        Accounts.emailTemplates.from     = "Tamerny Verification <verify@tamerny.com>";
        Accounts.emailTemplates.subject  = "[Tamerny] Verify Your Email";

        Accounts.emailTemplates.verifyEmail.html = function(user, url) {

          var emailAddress   = email
          var urlWithoutHash = url.replace( '#/', '' ).replace('tamerneyapp.herokuapp', 'tamerny')
          var supportEmail   = "help@tamerny.com"
          var mainText = "Please confirm your email address by clicking on the button below. Once it's done, Tamerny is officially your friend!  "
          var supportText = "If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: " + supportEmail
          var button = "Verify Email"

          return verificationEmailTemplate (urlWithoutHash, mainText, supportText, button);
        };

        Accounts.sendVerificationEmail(userId, email)
      },
      sendVerificationLinkWithPass: function(userId, email, pass, err) {
        Accounts.emailTemplates.siteName = "Tamerny";
        Accounts.emailTemplates.from     = "Tamerny Verification <verify@tamerny.com>";
        Accounts.emailTemplates.subject  = "[Tamerny] Verify Your Email";

        Accounts.emailTemplates.verifyEmail.html = function(user, url) {

          var emailAddress   = email
          var urlWithoutHash = url.replace( '#/', '' ).replace('tamerneyapp.herokuapp', 'tamerny')
          var supportEmail   = "help@tamerny.com"
          var mainText = "Please confirm your email address by clicking on the button below. Once it's done, Tamerny is officially your friend! Your temporary password is: " + pass
          var supportText = "If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: " + supportEmail
          var button = "Verify Email"

          return verificationEmailTemplate (urlWithoutHash, mainText, supportText, button);
        };
        
        Accounts.sendVerificationEmail(userId, email)
        
      },
      addEmail: function(userId, newEmail){
        Accounts.addEmail(userId, newEmail)
      },
      removeEmail: function(userId, oldEmail){
        Accounts.removeEmail(userId, oldEmail)
      }
    });   
});



// SECTION II: Function

function verificationEmailTemplate(url, mainText, supportText, button){
 
  var  email = '<!doctype html>'+
  '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">'+
  ' <head>'+
  '   <!-- NAME: FOLLOW UP -->'+
  '   <!--[if gte mso 15]>'+
  '   <xml>'+
  '     <o:OfficeDocumentSettings>'+
  '     <o:AllowPNG/>'+
  '     <o:PixelsPerInch>96</o:PixelsPerInch>'+
  '     </o:OfficeDocumentSettings>'+
  '   </xml>'+
  '   <![endif]-->'+
  '   <meta charset="UTF-8">'+
  '        <meta http-equiv="X-UA-Compatible" content="IE=edge">'+
  '        <meta name="viewport" content="width=device-width, initial-scale=1">'+
  '   <title>*|MC:SUBJECT|*</title>'+
  '        '+
  '    <style type="text/css">'+
  '   p{'+
  '     margin:10px 0;'+
  '     padding:0;'+
  '   }'+
  '   table{'+
  '     border-collapse:collapse;'+
  '   }'+
  '   h1,h2,h3,h4,h5,h6{'+
  '     display:block;'+
  '     margin:0;'+
  '     padding:0;'+
  '   }'+
  '   img,a img{'+
  '     border:0;'+
  '     height:auto;'+
  '     outline:none;'+
  '     text-decoration:none;'+
  '   }'+
  '   body,#bodyTable,#bodyCell{'+
  '     height:100%;'+
  '     margin:0;'+
  '     padding:0;'+
  '     width:100%;'+
  '   }'+
  '   .mcnPreviewText{'+
  '     display:none !important;'+
  '   }'+
  '   #outlook a{'+
  '     padding:0;'+
  '   }'+
  '   img{'+
  '     -ms-interpolation-mode:bicubic;'+
  '   }'+
  '   table{'+
  '     mso-table-lspace:0pt;'+
  '     mso-table-rspace:0pt;'+
  '   }'+
  '   .ReadMsgBody{'+
  '     width:100%;'+
  '   }'+
  '   .ExternalClass{'+
  '     width:100%;'+
  '   }'+
  '   p,a,li,td,blockquote{'+
  '     mso-line-height-rule:exactly;'+
  '   }'+
  '   a[href^=tel],a[href^=sms]{'+
  '     color:inherit;'+
  '     cursor:default;'+
  '     text-decoration:none;'+
  '   }'+
  '   p,a,li,td,body,table,blockquote{'+
  '     -ms-text-size-adjust:100%;'+
  '     -webkit-text-size-adjust:100%;'+
  '   }'+
  '   .ExternalClass,.ExternalClass p,.ExternalClass td,.ExternalClass div,.ExternalClass span,.ExternalClass font{'+
  '     line-height:100%;'+
  '   }'+
  '   a[x-apple-data-detectors]{'+
  '     color:inherit !important;'+
  '     text-decoration:none !important;'+
  '     font-size:inherit !important;'+
  '     font-family:inherit !important;'+
  '     font-weight:inherit !important;'+
  '     line-height:inherit !important;'+
  '   }'+
  '   .templateContainer{'+
  '     max-width:600px !important;'+
  '   }'+
  '   a.mcnButton{'+
  '     display:block;'+
  '   }'+
  '   .mcnImage{'+
  '     vertical-align:bottom;'+
  '   }'+
  '   .mcnTextContent{'+
  '     word-break:break-word;'+
  '   }'+
  '   .mcnTextContent img{'+
  '     height:auto !important;'+
  '   }'+
  '   .mcnDividerBlock{'+
  '     table-layout:fixed !important;'+
  '   }'+
  ' /*'+
  ' @tab Page'+
  ' @section Heading 1'+
  ' @style heading 1'+
  ' */'+
  '   h1{'+
  '     /*@editable*/color:#222222;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:40px;'+
  '     /*@editable*/font-style:normal;'+
  '     /*@editable*/font-weight:bold;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/letter-spacing:normal;'+
  '     /*@editable*/text-align:center;'+
  '   }'+
  ' /*'+
  ' @tab Page'+
  ' @section Heading 2'+
  ' @style heading 2'+
  ' */'+
  '   h2{'+
  '     /*@editable*/color:#222222;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:34px;'+
  '     /*@editable*/font-style:normal;'+
  '     /*@editable*/font-weight:bold;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/letter-spacing:normal;'+
  '     /*@editable*/text-align:left;'+
  '   }'+
  ' /*'+
  ' @tab Page'+
  ' @section Heading 3'+
  ' @style heading 3'+
  ' */'+
  '   h3{'+
  '     /*@editable*/color:#444444;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:22px;'+
  '     /*@editable*/font-style:normal;'+
  '     /*@editable*/font-weight:bold;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/letter-spacing:normal;'+
  '     /*@editable*/text-align:center;'+
  '   }'+
  ' /*'+
  ' @tab Page'+
  ' @section Heading 4'+
  ' @style heading 4'+
  ' */'+
  '   h4{'+
  '     /*@editable*/color:#999999;'+
  '     /*@editable*/font-family:Georgia;'+
  '     /*@editable*/font-size:20px;'+
  '     /*@editable*/font-style:italic;'+
  '     /*@editable*/font-weight:normal;'+
  '     /*@editable*/line-height:125%;'+
  '     /*@editable*/letter-spacing:normal;'+
  '     /*@editable*/text-align:left;'+
  '   }'+
  ' /*'+
  ' @tab Header'+
  ' @section Header Container Style'+
  ' */'+
  '   #templateHeader{'+
  '     /*@editable*/background-color:#ffffff;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:50% 50%;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:7px;'+
  '     /*@editable*/padding-bottom:7px;'+
  '   }'+
  ' /*'+
  ' @tab Header'+
  ' @section Header Interior Style'+
  ' */'+
  '   .headerContainer{'+
  '     /*@editable*/background-color:transparent;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:center;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:0;'+
  '     /*@editable*/padding-bottom:0;'+
  '   }'+
  ' /*'+
  ' @tab Header'+
  ' @section Header Text'+
  ' */'+
  '   .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{'+
  '     /*@editable*/color:#808080;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:16px;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/text-align:left;'+
  '   }'+
  ' /*'+
  ' @tab Header'+
  ' @section Header Link'+
  ' */'+
  '   .headerContainer .mcnTextContent a,.headerContainer .mcnTextContent p a{'+
  '     /*@editable*/color:#00ADD8;'+
  '     /*@editable*/font-weight:normal;'+
  '     /*@editable*/text-decoration:underline;'+
  '   }'+
  ' /*'+
  ' @tab Body'+
  ' @section Body Container Style'+
  ' */'+
  '   #templateBody{'+
  '     /*@editable*/background-color:#FFFFFF;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:center;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:27px;'+
  '     /*@editable*/padding-bottom:54px;'+
  '   }'+
  ' /*'+
  ' @tab Body'+
  ' @section Body Interior Style'+
  ' */'+
  '   .bodyContainer{'+
  '     /*@editable*/background-color:transparent;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:center;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:0;'+
  '     /*@editable*/padding-bottom:0;'+
  '   }'+
  ' /*'+
  ' @tab Body'+
  ' @section Body Text'+
  ' */'+
  '   .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{'+
  '     /*@editable*/color:#808080;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:16px;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/text-align:left;'+
  '   }'+
  ' /*'+
  ' @tab Body'+
  ' @section Body Link'+
  ' */'+
  '   .bodyContainer .mcnTextContent a,.bodyContainer .mcnTextContent p a{'+
  '     /*@editable*/color:#00ADD8;'+
  '     /*@editable*/font-weight:normal;'+
  '     /*@editable*/text-decoration:underline;'+
  '   }'+
  ' /*'+
  ' @tab Footer'+
  ' @section Footer Style'+
  ' */'+
  '   #templateFooter{'+
  '     /*@editable*/background-color:#ffffff;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:center;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:0px;'+
  '     /*@editable*/padding-bottom:0px;'+
  '   }'+
  ' /*'+
  ' @tab Footer'+
  ' @section Footer Interior Style'+
  ' */'+
  '   .footerContainer{'+
  '     /*@editable*/background-color:transparent;'+
  '     /*@editable*/background-image:none;'+
  '     /*@editable*/background-repeat:no-repeat;'+
  '     /*@editable*/background-position:center;'+
  '     /*@editable*/background-size:cover;'+
  '     /*@editable*/border-top:0;'+
  '     /*@editable*/border-bottom:0;'+
  '     /*@editable*/padding-top:0;'+
  '     /*@editable*/padding-bottom:0;'+
  '   }'+
  ' /*'+
  ' @tab Footer'+
  ' @section Footer Text'+
  ' */'+
  '   .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{'+
  '     /*@editable*/color:#FFFFFF;'+
  '     /*@editable*/font-family:Helvetica;'+
  '     /*@editable*/font-size:12px;'+
  '     /*@editable*/line-height:150%;'+
  '     /*@editable*/text-align:center;'+
  '   }'+
  ' /*'+
  ' @tab Footer'+
  ' @section Footer Link'+
  ' */'+
  '   .footerContainer .mcnTextContent a,.footerContainer .mcnTextContent p a{'+
  '     /*@editable*/color:#FFFFFF;'+
  '     /*@editable*/font-weight:normal;'+
  '     /*@editable*/text-decoration:underline;'+
  '   }'+
  ' @media only screen and (min-width:768px){'+
  '   .templateContainer{'+
  '     width:600px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   body,table,td,p,a,li,blockquote{'+
  '     -webkit-text-size-adjust:none !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   body{'+
  '     width:100% !important;'+
  '     min-width:100% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImage{'+
  '     width:100% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnCartContainer,.mcnCaptionTopContent,.mcnRecContentContainer,.mcnCaptionBottomContent,.mcnTextContentContainer,.mcnBoxedTextContentContainer,.mcnImageGroupContentContainer,.mcnCaptionLeftTextContentContainer,.mcnCaptionRightTextContentContainer,.mcnCaptionLeftImageContentContainer,.mcnCaptionRightImageContentContainer,.mcnImageCardLeftTextContentContainer,.mcnImageCardRightTextContentContainer{'+
  '     max-width:100% !important;'+
  '     width:100% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnBoxedTextContentContainer{'+
  '     min-width:100% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageGroupContent{'+
  '     padding:9px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnCaptionLeftContentOuter .mcnTextContent,.mcnCaptionRightContentOuter .mcnTextContent{'+
  '     padding-top:9px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageCardTopImageContent,.mcnCaptionBlockInner .mcnCaptionTopContent:last-child .mcnTextContent{'+
  '     padding-top:18px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageCardBottomImageContent{'+
  '     padding-bottom:9px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageGroupBlockInner{'+
  '     padding-top:0 !important;'+
  '     padding-bottom:0 !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageGroupBlockOuter{'+
  '     padding-top:9px !important;'+
  '     padding-bottom:9px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnTextContent,.mcnBoxedTextContentColumn{'+
  '     padding-right:18px !important;'+
  '     padding-left:18px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcnImageCardLeftImageContent,.mcnImageCardRightImageContent{'+
  '     padding-right:18px !important;'+
  '     padding-bottom:0 !important;'+
  '     padding-left:18px !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  '   .mcpreview-image-uploader{'+
  '     display:none !important;'+
  '     width:100% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Heading 1'+
  ' @tip Make the first-level headings larger in size for better readability on small screens.'+
  ' */'+
  '   h1{'+
  '     /*@editable*/font-size:30px !important;'+
  '     /*@editable*/line-height:125% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Heading 2'+
  ' @tip Make the second-level headings larger in size for better readability on small screens.'+
  ' */'+
  '   h2{'+
  '     /*@editable*/font-size:26px !important;'+
  '     /*@editable*/line-height:125% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Heading 3'+
  ' @tip Make the third-level headings larger in size for better readability on small screens.'+
  ' */'+
  '   h3{'+
  '     /*@editable*/font-size:20px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Heading 4'+
  ' @tip Make the fourth-level headings larger in size for better readability on small screens.'+
  ' */'+
  '   h4{'+
  '     /*@editable*/font-size:18px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Boxed Text'+
  ' @tip Make the boxed text larger in size for better readability on small screens. We recommend a font size of at least 16px.'+
  ' */'+
  '   .mcnBoxedTextContentContainer .mcnTextContent,.mcnBoxedTextContentContainer .mcnTextContent p{'+
  '     /*@editable*/font-size:14px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Header Text'+
  ' @tip Make the header text larger in size for better readability on small screens.'+
  ' */'+
  '   .headerContainer .mcnTextContent,.headerContainer .mcnTextContent p{'+
  '     /*@editable*/font-size:16px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Body Text'+
  ' @tip Make the body text larger in size for better readability on small screens. We recommend a font size of at least 16px.'+
  ' */'+
  '   .bodyContainer .mcnTextContent,.bodyContainer .mcnTextContent p{'+
  '     /*@editable*/font-size:16px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}  @media only screen and (max-width: 480px){'+
  ' /*'+
  ' @tab Mobile Styles'+
  ' @section Footer Text'+
  ' @tip Make the footer content text larger in size for better readability on small screens.'+
  ' */'+
  '   .footerContainer .mcnTextContent,.footerContainer .mcnTextContent p{'+
  '     /*@editable*/font-size:14px !important;'+
  '     /*@editable*/line-height:150% !important;'+
  '   }'+
  ''+
  '}</style>'+
  '                    <script>var w=window;if(w.performance||w.mozPerformance||w.msPerformance||w.webkitPerformance){var d=document;AKSB=w.AKSB||{},AKSB.q=AKSB.q||[],AKSB.mark=AKSB.mark||function(e,_){AKSB.q.push(["mark",e,_||(new Date).getTime()])},AKSB.measure=AKSB.measure||function(e,_,t){AKSB.q.push(["measure",e,_,t||(new Date).getTime()])},AKSB.done=AKSB.done||function(e){AKSB.q.push(["done",e])},AKSB.mark("firstbyte",(new Date).getTime()),AKSB.prof={custid:"405172",ustr:"",originlat:"0",clientrtt:"66",ghostip:"92.122.54.15",ipv6:false,pct:"10",clientip:"95.145.132.65",requestid:"7397d50d",region:"22075",protocol:"h2",blver:13,akM:"x",akN:"ae",akTT:"O",akTX:"1",akTI:"7397d50d",ai:"365711",ra:"false",pmgn:"",pmgi:"",pmp:"",qc:""},function(e){var _=d.createElement("script");_.async="async",_.src=e;var t=d.getElementsByTagName("script"),t=t[t.length-1];t.parentNode.insertBefore(_,t)}(("https:"===d.location.protocol?"https:":"http:")+"//ds-aksb-a.akamaihd.net/aksb.min.js")}</script>'+
  '                    </head>'+
  '    <body>'+
  '   <!--*|IF:MC_PREVIEW_TEXT|*-->'+
  '   <!--[if !gte mso 9]><!----><span class="mcnPreviewText" style="display:none; font-size:0px; line-height:0px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; visibility:hidden; mso-hide:all;">*|MC_PREVIEW_TEXT|*</span><!--<![endif]-->'+
  '   <!--*|END:IF|*-->'+
  '        <center>'+
  '            <table align="center" border="0" cellpadding="0" cellspacing="0" height="100%" width="100%" id="bodyTable">'+
  '                <tr>'+
  '                    <td align="center" valign="top" id="bodyCell">'+
  '                        <!-- BEGIN TEMPLATE // -->'+
  '                        <table border="0" cellpadding="0" cellspacing="0" width="100%">'+
  '             <tr>'+
  '               <td align="center" valign="top" id="templateHeader" data-template-container>'+
  '                 <!--[if gte mso 9]>'+
  '                 <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">'+
  '                 <tr>'+
  '                 <td align="center" valign="top" width="600" style="width:600px;">'+
  '                 <![endif]-->'+
  '                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">'+
  '                   <tr>'+
  '                                     <td valign="top" class="headerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnImageBlock" style="min-width:100%;">'+
  '    <tbody class="mcnImageBlockOuter">'+
  '            <tr>'+
  '                <td valign="top" style="padding:9px" class="mcnImageBlockInner">'+
  '                    <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" class="mcnImageContentContainer" style="min-width:100%;">'+
  '                        <tbody><tr>'+
  '                            <td class="mcnImageContent" valign="top" style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">'+
  '                                '+
  '                                    '+
  '                                        <img align="center" alt="" src="https://gallery.mailchimp.com/70a9d56170a0364a57499f9a3/images/1b30ec4e-0871-4b46-897b-53c2b26bf859.png" width="300" style="max-width:300px; padding-bottom: 0; display: inline !important; vertical-align: bottom;" class="mcnImage">'+
  '                                    '+
  '                                '+
  '                            </td>'+
  '                        </tr>'+
  '                    </tbody></table>'+
  '                </td>'+
  '            </tr>'+
  '    </tbody>'+
  '</table></td>'+
  '                   </tr>'+
  '                 </table>'+
  '                 <!--[if gte mso 9]>'+
  '                 </td>'+
  '                 </tr>'+
  '                 </table>'+
  '                 <![endif]-->'+
  '               </td>'+
  '                            </tr>'+
  '             <tr>'+
  '               <td align="center" valign="top" id="templateBody" data-template-container>'+
  '                 <!--[if gte mso 9]>'+
  '                 <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">'+
  '                 <tr>'+
  '                 <td align="center" valign="top" width="600" style="width:600px;">'+
  '                 <![endif]-->'+
  '                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">'+
  '                   <tr>'+
  '                                     <td valign="top" class="bodyContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">'+
  '    <tbody class="mcnTextBlockOuter">'+
  '        <tr>'+
  '            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">'+
  '               <!--[if mso]>'+
  '       <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">'+
  '       <tr>'+
  '       <![endif]-->'+
  '         '+
  '       <!--[if mso]>'+
  '       <td valign="top" width="600" style="width:600px;">'+
  '       <![endif]-->'+
  '                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">'+
  '                    <tbody><tr>'+
  '                        '+
  '                        <td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px; font-family: \'Helvetica Neue\', Helvetica, Arial, Verdana, sans-serif; font-size: 14px; line-height: 100%;">'+
  '                        '+
  '                            <h1 class="null"><span class="mc-toc-title"><span style="font-family:helvetica neue,helvetica,arial,verdana,sans-serif">You\'re almost there! </span></span></h1>'+
  ''+
  '                        </td>'+
  '                    </tr>'+
  '                </tbody></table>'+
  '       <!--[if mso]>'+
  '       </td>'+
  '       <![endif]-->'+
  '                '+
  '       <!--[if mso]>'+
  '       </tr>'+
  '       </table>'+
  '       <![endif]-->'+
  '            </td>'+
  '        </tr>'+
  '    </tbody>'+
  '</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">'+
  '    <tbody class="mcnTextBlockOuter">'+
  '        <tr>'+
  '            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">'+
  '               <!--[if mso]>'+
  '       <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">'+
  '       <tr>'+
  '       <![endif]-->'+
  '         '+
  '       <!--[if mso]>'+
  '       <td valign="top" width="600" style="width:600px;">'+
  '       <![endif]-->'+
  '                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">'+
  '                    <tbody><tr>'+
  '                        '+
  '                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">'+
  '                        '+
  '                            <p>' + mainText  + '<br>'+
  '<br>'+ supportText + '</p>'+
  ''+
  '                        </td>'+
  '                    </tr>'+
  '                </tbody></table>'+
  '       <!--[if mso]>'+
  '       </td>'+
  '       <![endif]-->'+
  '                '+
  '       <!--[if mso]>'+
  '       </tr>'+
  '       </table>'+
  '       <![endif]-->'+
  '            </td>'+
  '        </tr>'+
  '    </tbody>'+
  '</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnDividerBlock" style="min-width:100%;">'+
  '    <tbody class="mcnDividerBlockOuter">'+
  '        <tr>'+
  '            <td class="mcnDividerBlockInner" style="min-width: 100%; padding: 9px 18px 0px;">'+
  '                <table class="mcnDividerContent" border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">'+
  '                    <tbody><tr>'+
  '                        <td>'+
  '                            <span></span>'+
  '                        </td>'+
  '                    </tr>'+
  '                </tbody></table>'+
  '<!--            '+
  '                <td class="mcnDividerBlockInner" style="padding: 18px;">'+
  '                <hr class="mcnDividerContent" style="border-bottom-color:none; border-left-color:none; border-right-color:none; border-bottom-width:0; border-left-width:0; border-right-width:0; margin-top:0; margin-right:0; margin-bottom:0; margin-left:0;" />'+
  '-->'+
  '            </td>'+
  '        </tr>'+
  '    </tbody>'+
  '</table><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonBlock" style="min-width:100%;">'+
  '    <tbody class="mcnButtonBlockOuter">'+
  '        <tr>'+
  '            <td style="padding-top:0; padding-right:18px; padding-bottom:18px; padding-left:18px;" valign="top" align="center" class="mcnButtonBlockInner">'+
  '                <table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnButtonContentContainer" style="border-collapse: separate !important;border-radius: 3px;background-color: #00ADD8;">'+
  '                    <tbody>'+
  '                        <tr>'+
  '                            <td align="center" valign="middle" class="mcnButtonContent" style="font-family: Helvetica; font-size: 18px; padding: 18px;">'+
  '                                <a class="mcnButton " title='+ button +' href='+url+' target="_self" style="font-weight: bold;letter-spacing: -0.5px;line-height: 100%;text-align: center;text-decoration: none;color: #FFFFFF;">'+ button +'</a>'+
  '                            </td>'+
  '                        </tr>'+
  '                    </tbody>'+
  '                </table>'+
  '            </td>'+
  '        </tr>'+
  '    </tbody>'+
  '</table></td>'+
  '                   </tr>'+
  '                 </table>'+
  '                 <!--[if gte mso 9]>'+
  '                 </td>'+
  '                 </tr>'+
  '                 </table>'+
  '                 <![endif]-->'+
  '               </td>'+
  '                            </tr>'+
  '                            <tr>'+
  '               <td align="center" valign="top" id="templateFooter" data-template-container>'+
  '                 <!--[if gte mso 9]>'+
  '                 <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;">'+
  '                 <tr>'+
  '                 <td align="center" valign="top" width="600" style="width:600px;">'+
  '                 <![endif]-->'+
  '                 <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" class="templateContainer">'+
  '                   <tr>'+
  '                                     <td valign="top" class="footerContainer"><table border="0" cellpadding="0" cellspacing="0" width="100%" class="mcnTextBlock" style="min-width:100%;">'+
  '    <tbody class="mcnTextBlockOuter">'+
  '        <tr>'+
  '            <td valign="top" class="mcnTextBlockInner" style="padding-top:9px;">'+
  '               <!--[if mso]>'+
  '       <table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;">'+
  '       <tr>'+
  '       <![endif]-->'+
  '         '+
  '       <!--[if mso]>'+
  '       <td valign="top" width="600" style="width:600px;">'+
  '       <![endif]-->'+
  '                <table align="left" border="0" cellpadding="0" cellspacing="0" style="max-width:100%; min-width:100%;" width="100%" class="mcnTextContentContainer">'+
  '                    <tbody><tr>'+
  '                        '+
  '                        <td valign="top" class="mcnTextContent" style="padding-top:0; padding-right:18px; padding-bottom:9px; padding-left:18px;">'+
  '                        '+
  '                            <p><span style="color:#000000">© 2017 Tamerny<sup>®</sup>, All Rights Reserved.<br>'+
  'Jeddah, Saudi Arabia </span></p>'+
  '<br>'+
  ' '+
  '                        </td>'+
  '                    </tr>'+
  '                </tbody></table>'+
  '       <!--[if mso]>'+
  '       </td>'+
  '       <![endif]-->'+
  '                '+
  '       <!--[if mso]>'+
  '       </tr>'+
  '       </table>'+
  '       <![endif]-->'+
  '            </td>'+
  '        </tr>'+
  '    </tbody>'+
  '</table></td>'+
  '                   </tr>'+
  '                 </table>'+
  '                 <!--[if gte mso 9]>'+
  '                 </td>'+
  '                 </tr>'+
  '                 </table>'+
  '                 <![endif]-->'+
  '               </td>'+
  '                            </tr>'+
  '                        </table>'+
  '                        <!-- // END TEMPLATE -->'+
  '                    </td>'+
  '                </tr>'+
  '            </table>'+
  '        </center>'+
  '    </body>'+
  '</html>';

   return email 
}


 