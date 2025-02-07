import { domain } from "./constants.js"
import { sendEmail } from "./email.js"

export const sendPasswordResetMail = async(email,token)=>{

    const subject = "Reset Password"
    const message = `
        <h1>Reset Password</h1>
        <p>Please click the following link to set new password:</p>
        <a href="${domain}/verify/${token}">Verify Email</a>
    `

    await sendEmail(email,subject,message)
}