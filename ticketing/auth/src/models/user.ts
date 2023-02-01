import mongoose from 'mongoose'
import { Password } from '../services'

interface UserAttrs {
    email:string,
    password: string
}

// interface describe properties that User model has
interface UserModel extends mongoose.Model<UserDoc>{
    build(attrs: UserAttrs):UserDoc
}

// interface describe properties that User Document has
interface UserDoc extends mongoose.Document{
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true
    },
    password:{
        type: String,
        require: true
    }
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id
            delete ret.password
        },
        versionKey: false
    }
})

// Middleware to save hash password
userSchema.pre('save',async function (done) {
    if(this.isModified('password')){
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }
    done()
})

//Add new function
userSchema.statics.build = (attrs: UserAttrs) =>{
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)
export {User}