const mongoose= require('mongoose'),
    validator= require('validator'),
    jwt= require('jsonwebtoken'),
    bcrypt= require('bcryptjs');

const personSchema = mongoose.Schema({
    firstName: {
        type: String,
        require: true,
        trim: true
    },
    lastName: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 8,
        validate(value){
            if (value.toLowerCase().includes('password')){
                throw new Error('Do not use the word "password" in your password')
            }
        }
    },
    state: {
        type: String,
        require: false,
        trim: true
    },
    lastLogin: {
        type: Number,
        require: false
    },
    tokens: [
        {
            token: {
                type: String,
                require: false
            }
        }
    ]
})

personSchema.pre("save", async function(next){
    const person= this;
    if(person.isModified("password")){
        person.password= await bcrypt.hash(person.password, 8)
    }
    next()
})

personSchema.methods.generateAuthToken = async function(){
    const person= this
    const token= jwt.sign({_id: person._id, name: person.lastName, email: person.email}, 'secret')
    person.tokens= person.tokens.concat({token})
    await person.save()
    return token
}

const Person= mongoose.model('Person', personSchema);

module.exports= Person;
