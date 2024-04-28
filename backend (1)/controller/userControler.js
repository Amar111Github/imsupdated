const userModule = require("../moduls/userModule");
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const sendMessage = require('../email/sendMail')
const otpModule = require('../moduls/otpModule')
const SALT_FACTOUR = 10;
require('dotenv').config()


// create a user 
const createUser = async (req, res) => {
    const employer = req.body;
    const { userEmail, userPass } = req.body;

    const newUser = new userModule(employer);

    try {
        const salt = await bcrypt.genSalt(SALT_FACTOUR);
        const hash = await bcrypt.hash(userPass, salt);

        newUser.userPass = hash;

        const findUser = await userModule.findOne({ userEmail: userEmail });

        if (!findUser) {
            await newUser.save();
            res.status(201).json({
                result: newUser
            });
        } else {
            res.status(500).json({
                message: 'User already exists'
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'User is not created'
        });
    }
};


// get the all data 
const getUserData = async (req, res) => {

    try {
        const result = await userModule.find({})
        res.status(500).json({
            message: 'find all data',
            result: result,
            count: result.length
        })
    } catch {
        res.status(500).json({
            message: 'your get Requst is faild',
        })
    }
}

const deleteUser = async (req, res) => {

    const id = req.params.id;

    try {
        await userModule.findByIdAndDelete(id);

        res.status(200).json({
            message: 'your acount is successfully deleted',
        })
    } catch {
        res.status(500).json({
            message: 'your acouts is note deleted',
        })
    }
}

// login user requst
const loginUser = async (req, res) => {

    const { userEmail, userPass } = req.body;
    const findUser = await userModule.findOne({ userEmail: userEmail })
    try {
        if (!findUser) {
            res.status(400).json({
                message: 'user dose not exist'
            })
        } else {
            const findPass = await bcrypt.compareSync(userPass, findUser.userPass);
            if (!findPass) {
                res.status(400).json({
                    message: 'invalid Password'
                })
            }
            else {
                Jwt.sign({ userEmail }, process.env.SALTKEY, (err, tokan) => {
                    if (err) {
                        res.status(400).json({
                            message: 'somethig what rong Place try again letter'
                        })
                    } else {
                        res.status(200).json({
                            user: findUser,
                            tokan: tokan
                        })
                    }
                })

            }
        }
    } catch {
        res.status(500).json({
            message: 'login faild'
        })
    }
}

// forget password 
const emailVerify = async (req, res) => {

    const { userEmail } = req.body;
    console.log(userEmail)
    const findemail = await userModule.findOne({ userEmail: userEmail });
    console.warn(findemail)

    try {
      
        if (!findemail) {
            console.log(findemail)
            res.status(400).json({
                message: 'Enter valid email id'
            })
        } else {
            let day = new Date();
            let secound = day.getSeconds() + 30;
            res.status(200).json({
                message: 'ok',
                time: secound
            })
            sendOtp(findemail._id, findemail._userEmail)

        }
    } catch {
        res.status(500).json({
            message: 'your requist is faild'
        })
    }
}

// verify otp 

const verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const findnum = await otpModule.findOne({ otp: otp });
        const id = findnum._id;

        if (findnum) {
            await otpModule.findByIdAndDelete(id)
            res.status(200).json({
                message: 'ok'
            })
        } else {
            res.status(400).json({
                message: 'enter valid num'
            })
        }
    } catch {
        res.status(500).json({
            message: 'your requist is faild'
        })
    }
}

// send otp 
const sendOtp = async (id, email) => {
    const otp = { userId: id, otp: Math.floor(Math.random() * 9000) + 1000 }
    
    const newOtp = otpModule(otp);
    let { _id } = newOtp;
    try {
        await newOtp.save()
        sendMessage(otp.otp.toString(), email)
        console.log('otp was send');
        deleteOtp(_id)
    } catch {
        console.log('otp was not send');
    }
}

// delete otp in database 
const deleteOtp = async (id) => {

    let time = 30;
    setInterval(async () => {
        if (time <= 0) {
          
        } else {
            time = time - 1
            console.log(time);
        }
        if(time === 0) {
            try {
                await otpModule.findByIdAndDelete(id)
            } catch {
                console.log('faild this api');
            }  
        }
    }, 1000)

}

// forget password 
const forgetUserPass = async (req, res) => {
    let user = req.body;
    const id = req.params.id;

    try {
        user.userPass = await bcrypt.hash(user.userPass, 10);
        await userModule.findByIdAndUpdate(id, user)
        const findUser = await userModule.findOne({ _id: id })

        res.status(200).json({
            message: 'password is updated',
            result: findUser
        })
    } catch (err) {
        res.status(400).json({
            message: 'Password forget request is faild',
        })
    }
}


module.exports = {
    createUser,
    emailVerify,
    getUserData,
    verifyOtp,
    sendOtp,
    deleteUser,
    loginUser,
    forgetUserPass
}