import mongoose from 'mongoose'
import { app } from './app'



const start = async() =>{
    if(!process.env.JWT_KEY || !process.env.MONGO_URI)
    throw new Error("JWT_KEY or MONGO_URI must be defined")
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.info("Conected to mongodb")
    } catch (error) {
        console.error(error)
    }

    app.listen(3000, () =>{
        console.log("Listening on port 3000!!!!")
    })
}

start()