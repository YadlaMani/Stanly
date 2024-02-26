const mongoose=require('mongoose');
const initdata=require('./data.js');

const MONGO_URL="mongodb://127.0.0.1:27017/Flash";
const Listing=require('../models/listing.js');
main().then(()=>{
    console.log("DB is runing");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}
const initDB=async ()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"65ca3cea752a291ce41d51ae"}));
    await Listing.insertMany(initdata.data);
    console.log("data was intialized");



}
initDB();