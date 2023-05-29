
const dotenv=require("dotenv")
dotenv.config()


const sessionSecret =process.env.secrect;

module.exports={
    sessionSecret,
}