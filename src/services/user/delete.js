/* eslint-disable */
const functions = require("firebase-functions");
const admin = require("firebase-admin");

/** Delete User event */
module.exports = deleted = functions.firestore.document('/users/{userId}')
.onDelete((snap, context)=>{
    const userId = snap.id;
    admin.auth().deleteUser(userId)
    .then(()=>console.log('User deleted!'))
    .catch((err)=>console.error(err))
})