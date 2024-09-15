import mongoose from "mongoose";

let isConnected = false;

export const connectToDb = async () => {
    mongoose.set("strictQuery", true);
    
    if(isConnected){
        console.log("Connection already established");
        return ;
    }try {
        await mongoose.connect(process.env.MONGO_URI)
        isConnected = true;
        console.log("Connection established");
    } catch (error) {
        console.log(error);
    }
    
}