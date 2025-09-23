const mongoose=require('mongoose')

const userSchema=mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:"Please enter your phone"
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},
{
    timeStamps:true
}
)

module.exports=mongoose.model('user',userSchema)