import { domain } from "./constants.js"
import { sendEmail } from "./email.js"

export const sendEmailVerification = async(email,token)=>{

    const subject = "Email Verification"
    const message = `
        <h1>Email Verification</h1>
        <p>Please click the following link to verify your email address:</p>
        <a href="${domain}/verify/${token}">Verify Email</a>
    `

    await sendEmail(email,subject,message)
}