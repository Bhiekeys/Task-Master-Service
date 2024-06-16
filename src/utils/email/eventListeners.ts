import EventEmitter from 'events';
import { sendEmail } from './emailSender';
import { forgotPasswordTemp } from '../templates/forgot-password-temp';
import { verifyUserTemp } from '../templates/verify-user-temp';

const emitter = new EventEmitter();

emitter.on('forgot-password', async (data: { email: string; otp: string; firstName: string }) => {
  await sendEmail({
    email: data.email,
    subject: 'Forgot Password',
    message: forgotPasswordTemp(data.firstName, data.otp),
  });
});

emitter.on('verify-user', async (data: { email: string; otp: string; firstName: string }) => {
  await sendEmail({
    email: data.email,
    subject: 'Verify Your Account',
    message: verifyUserTemp(data.firstName, data.otp),
  });
});

export default emitter;
