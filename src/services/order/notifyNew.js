const functions = require("firebase-functions");
const admin = require("firebase-admin");

/**                                    Cloud notification for order placed                                       */
module.exports = notifyNew = functions.firestore.document('/orders/{orderId}')
.onCreate((snap, context)=>{
    const restaurateurId = snap.get('from.owner');
    const orderId = snap.get('id');
    admin.firestore().collection('users').doc(restaurateurId).get()
    .then((restaurateur)=>{
            const data ={
                notification: {
                    title: `New order`,
                    body: `Order ${orderId} have been placed`,
                    image: 'https://firebasestorage.googleapis.com/v0/b/tchopify.appspot.com/o/FCMImages%2Fic_package.svg?alt=media&token=2bb50b44-c581-48bc-a9c9-98f3465cbf76',

                },
                token: restaurateur.data().token
            }
            admin.messaging().send(data)
    })
    
})