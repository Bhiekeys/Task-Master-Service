import EventEmitter from 'events';
import { sendEmail } from './emailSender';
import { forgotPasswordTemp } from '../templates/forgot-password-temp';

const emitter = new EventEmitter();

emitter.on('forgot-password', async (data: { email: string; otp: string; name: string }) => {
  await sendEmail({
    email: data.email,
    subject: 'Forgot Password',
    message: await forgotPasswordTemp(data.name, data.otp),
  });
});

export default emitter;
