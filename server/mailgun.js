/*
  This server side JS file is main file that takes care of all 
  emails being sent either for verification or for other reasons.
*/


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
      isEmailValid: function(address) {
        console.log("VERIFY EMAIL FROM SERVER")
        console.log(address)
        // check(address, String);

        // modify this with your key
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

        Accounts.emailTemplates.verifyEmail = {
          subject() {
            return "[Tamerny] Verify Your Email Address";
          },
          text( user, url ) {
            let emailAddress   = email,
                urlWithoutHash = url.replace( '#/', '' ).replace('tamerneyapp.herokuapp', 'tamerny'),
                supportEmail   = "tech@tamerny.com",
                emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
            return emailBody;
          }
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


 