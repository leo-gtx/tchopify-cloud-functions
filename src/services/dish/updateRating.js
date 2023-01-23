const functions = require("firebase-functions");
const admin = require("firebase-admin");

/* eslint-disable */
/**                       Crons' tasks for update dish rating                                               */
module.exports = updateRating = functions.firestore.document('/reviews/{reviewId}')
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