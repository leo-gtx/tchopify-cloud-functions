/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

/** Cloud notification for order status changed */
module.exports = notifyStatusChanged = functions.firestore.document('/orders/{orderId}')
.onUpdate((snap, context)=>{
    if (snap.before.get('status') !== snap.after.get('status')){
        const customerId = snap.before.get('billing.userId');
        const restaurateurId = snap.before.get('from.owner');
        const orderId = snap.before.get('id');
        admin.firestore().collection('users').doc(restaurateurId).get()
        .then((restaurateur)=>{
            admin.firestore().collection('users').doc(customerId).get()
            .then((customer)=>{
                const data ={
                    notification: {
                        title: `Order ${snap.after.data().status}`,
                        body: `Order ${orderId} status changed`,
                        image: 'https://firebasestorage.googleapis.com/v0/b/tchopify.appspot.com/o/FCMImages%2Fic_delivery.svg?alt=media&token=eba1ad47-2655-4ead-acde-21bc19aa394b'
                    },
                    tokens: [restaurateur.data().token, customer.data().token]
                }
                admin.messaging().sendMulticast(data)
            })
        })
        
    }
})