Meteor.startup(function() {  
    Meteor.methods({
      sendEmail: function (mailFields) {
        console.log("about to send email...");
        check([mailFields.to, mailFields.from, mailFields.subject, mailFields.text, mailFields.html], [String]);
        this.unblock();

        Meteor.Mailgun.send({
            to: mailFields.to,
            from: mailFields.from,
            subject: mailFields.subject,
            text: mailFields.text,
            html: mailFields.html
        });
      },
      sendVerificationLink: function(userId, email, err) {
        console.log("INSIDE sendVerificationLink")
        Accounts.emailTemplates.siteName = "Tamerny";
        Accounts.emailTemplates.from     = "Tamerny Verification <verify@tamerny.com>";

        Accounts.emailTemplates.verifyEmail = {
          subject() {
            return "[Tamerny] Verify Your Email Address";
          },
          text( user, url ) {
            let emailAddress   = email,
                urlWithoutHash = url.replace( '#/', '' ),
                supportEmail   = "support@tamerny.com",
                emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

            return emailBody;
          }
        };
        // Uncomment when MAILGUN bitch fixes everything
        Accounts.sendVerificationEmail(userId, email)
        console.log("Email should have been sent")
      },
      addEmail: function(userId, newEmail){
        Accounts.addEmail(userId, newEmail)
      },
      removeEmail: function(userId, oldEmail){
        Accounts.removeEmail(userId, oldEmail)
      }
    });   
});



// Meteor.users.after.insert(function (userId, doc){
  
//   Accounts.emailTemplates.siteName = "Tamerny";
//   Accounts.emailTemplates.from     = "Tamerny Verification <verify@Tamerny.com>";

//   Accounts.emailTemplates.verifyEmail = {
//     subject() {
//       return "[Tamerny] Verify Your Email Address";
//     },
//     html( user, url ) {
//       let emailAddress   = doc.emails[0].address,
//       urlWithoutHash = url.replace( '#/', '' ),
//       supportEmail   = "support@tamerny.com",
//       emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;
  
//       return emailBody;
//     }
//   };

// Accounts.sendVerificationEmail(doc._id, doc.emails[0].address)
  
// });

 