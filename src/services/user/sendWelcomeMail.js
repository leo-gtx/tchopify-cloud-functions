/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
/** Send welcome mail for new user */
// eslint-disable-next-line
module.exports = sendWelcomeMail = functions.firestore.document('/users/{userId}')
.onCreate((snap, context)=>{
    const SUPPORT_ID = "D82QlAS3nVQGfhFmpPUIWcou2UJ2";
    const userId = snap.id
    const fullname = snap.get('fullname');
    const role = snap.get('role');
    if(role.includes('ROLE_OWNER')){
        admin.firestore().collection('mail').add({
            toUids: [userId, SUPPORT_ID],
            template: {
                name: "newuser",
                data: {
                    greating:  `Bienvenue ${fullname} :)`,
                    username: fullname,
                    content: "Pour finaliser votre inscription, veuillez contactez le support au +237 698 618 200 / +237 676 411 506 / support@tchopify.com, pour l'activation de votre compte.",
                    signature: "Cordialement, l'équipe Tchopify",
                    footerTitle: "Suivez-nous"
                }
            }
        })
    }
})