const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

/* eslint-disable */
/**                       Crons' tasks                                               */
exports.updateDishRating = functions.firestore.document('/reviews/{reviewId}')
 .onWrite((snap, context) => {
   const {dishId} = snap.after.data();
   admin
   .firestore()
   .collection('reviews')
   .where('dishId','==', dishId)
   .get()
   .then((reviews)=>{
    let rating = 0;
    if ( !reviews.empty ){
      reviews.docs.forEach((item)=>{
        rating += item.data().rating;
      });
      rating = rating / reviews.size;
    }
    admin
    .firestore()
    .collection('dishes')
    .doc(dishId)
    .update({rating, totalReview: reviews.size})
   });
   
})

exports.updateShopRating = functions.firestore.document('/orders/{orderId}')
.onUpdate((snap, context)=>{
    if(snap.before.get('rating') !== snap.after.get('rating')){
        const userRating = snap.after.get('rating');
        const shopId = snap.after.get('from.id');
        admin.firestore().collection('restaurants')
        .then((snapDoc)=>{
            const {rating, reviews} = snapDoc.data();
            const shopRating = (rating * reviews + userRating) / (reviews + 1);
            admin.firestore().collection('restaurants')
            .doc(shopId)
            .update({rating: shopRating, reviews})
        })
    }
})


/**                                    Cloud notification                                         */

exports.notifyPlaceOrder = functions.firestore.document('/orders/{orderId}')
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

exports.notifyAfterOrderStatusChanged = functions.firestore.document('/orders/{orderId}')
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

exports.sendWelcomeMail = functions.firestore.document('/users/{userId}')
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
        .then(()=>console.log("Queued email for delivery!"))
    }
})

exports.deleteUser = functions.firestore.document('/users/{userId}')
.onDelete((snap, context)=>{
    const userId = snap.id;
    admin.auth().deleteUser(userId)
    .then(()=>console.log('User deleted!'))
    .catch((err)=>console.error(err))
})