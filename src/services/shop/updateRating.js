/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

/* eslint-disable */
/**                       Crons' tasks for update shop rating                                              */
module.exports = updateRating = functions.firestore.document('/orders/{orderId}')
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