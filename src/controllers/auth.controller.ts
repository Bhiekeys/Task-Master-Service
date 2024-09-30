import User from '../models/user.model';
import {Request, Response} from 'express';
import { IUser } from '../models/user.model';
import { successResponse } from '../utils/serverResponse/successResponse';
import { errorResponse } from '../utils/serverResponse/errorResponse';
import { compare, generateRandomOTP, hash } from '../utils/hashes/hasher';
import { generateToken, verifyToken } from '../utils/hashes/jwtHandler';
import emitter from '../utils/email/eventListeners';
import OTP, { IOTP } from '../models/otp.model';
import { INewUser, IUserReturnData, IUserToken } from '../interfaces/user.interface';
import ConstantService from '../services/constant.service';

class AuthController {
    static async userSignUp(req: Request, res: Response) {
        try {
           const { firstName, lastName, email, password, confirmPassword} = req.body
           const { JWT_EXPIRES, JWT_SECRET, PORT } = process.env

           const requiredFields = ['firstName', 'lastName','email', 'password', 'confirmPassword'];

            const validationErrors = requiredFields.filter(field => !req.body[field]);

            if (validationErrors.length > 0) {
                const errorMessage = `The following fields are required: ${validationErrors.join(', ')}`;
                return errorResponse(res, errorMessage, 400);
            }

           const formattedEmail: string = email.toLowerCase();
           
           const userExist: IUser | null = await ConstantService.findModelByOne(User, { email: formattedEmail });
          
           if (userExist) return errorResponse(res, 'user already exist, please sign in', 400);

           if (password !== confirmPassword) return errorResponse(res, 'password must tally', 400);

           const hashPwd: string = await hash(password);

           const newUser: INewUser = {
              firstName,
              lastName,
              email: formattedEmail,
              password: hashPwd,
           };

           const user: IUser = await User.create(newUser);

           const tokenPayload: IUserToken = {
            id: user._id,
            email: formattedEmail,
            isVerified: user.isVerified
           };
           
           const token: string = generateToken(tokenPayload, JWT_SECRET as string, JWT_EXPIRES as string);

           const verificationLink = `https://task-master-service.onrender.com/api/v1/auth/verify?token=${token}`;        

           emitter.emit('verify-user', {email: formattedEmail, firstName, verificationLink});

           return successResponse(res, 'user created successfully, please check your email and verify your account')           
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async verifyUser(req: Request, res: Response) {
        try {
            let { token } = req.query;

            if (!token) errorResponse(res, 'Invalid Request', 401);
            
            const secretKey = process.env.JWT_SECRET as string;
            const decodedToken: IUserToken | any = verifyToken(token as string, secretKey);            

            const user: IUser | null = await ConstantService.findModelById(User, decodedToken.id);

            if (!user) return errorResponse(res, 'Verification token expired', 400);

            // Check if the user is already verified
            if (user.isVerified) return errorResponse(res, `${user.firstName}, you're already verified`, 400);
            
            // Update user's verification status
            await User.updateOne({_id: user._id}, {$set: { isVerified: true }});

            return res.redirect('https://task-master-web-app.vercel.app/auth/login');
            // successResponse(res, `Hey ${user.firstName}, your account has been verified successfully`);
        } catch (error: any) {
           return errorResponse(res, error.message, 500);
        }
    }

    static async login(req:Request, res:Response) {
        try {
            const { email, password } = req.body;
            const formattedEmail: string = email.toLowerCase()

            const user: IUser | null = await ConstantService.findModelByOne(User, { email: formattedEmail });

            if (!user) return errorResponse(res, 'user does not exist', 400);

            const isPasswordValid = await compare(password, user.password as string);

            if (!isPasswordValid) return errorResponse(res, 'Invalid Credentials', 400);            
            
            if (!user.isVerified) return errorResponse(res, 'User is not yet verified, please verify your account', 400);

            const tokenPayload: IUserToken = {
                id: user._id,
                email: formattedEmail,
                isVerified: user.isVerified
               };
               
            const token: string = generateToken(tokenPayload, process.env.JWT_SECRET as string, process.env.JWT_EXPIRES as string);

            const ReturnUserData: IUserReturnData = {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isVerified: user.isVerified
            }

            return successResponse(res, 'logged in successfully', { token, data: ReturnUserData });
        } catch (error: any) {
            errorResponse(res, error.message, 500);
        }
    }

    static async forgotPassword(req:Request, res:Response) {
        try {
            let { email } = req.body;
            email = email.toLowerCase();

            const user: IUser | null = await ConstantService.findModelByOne(User, { email });
            if (!user) return errorResponse(res, 'user does not exist', 400);

            // Generate OTP
            const otpToken = generateRandomOTP();

            // convert otp to string to enable hashing
            const otpString = String(otpToken);

            const hashOtp = await hash(otpString);

            // Send email
            emitter.emit('forgot-password', {email, otp: otpString, firstName: user.firstName});

            let expireDate = new Date()
            expireDate.setMinutes(expireDate.getMinutes() + 5);

            // check if otp exist
            const isOTPExist = await ConstantService.findModelByOne(OTP, { userId: user._id});

            if (isOTPExist) return errorResponse(res, 'user has already requested for OTP', 400);
            
            await OTP.create({ otpToken: hashOtp, expiresAt: new Date(expireDate), userId: user._id, purpose: 'password' });

            return successResponse(res, 'OTP sent to email to reset password', { email });
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async verifyOtp(req: Request, res: Response) {
        try {
            const { otp } = req.body;
            const { email } = req.params;

            const user: IUser | null = await ConstantService.findModelByOne(User, { email }); 
            if (!user) return errorResponse(res, 'user does not exist', 400);

            const otpModel: IOTP | null = await ConstantService.findModelByOne(OTP, { userId: user._id });

            //check if OTP has expired
            if (!otpModel || new Date() > new Date(otpModel?.expiresAt)) {
                if (otpModel) await OTP.deleteMany({ userId: user._id });
                return errorResponse(res, 'OTP is expired or does not exists', 400);
            }
            const isValidOTP = await compare(otp, otpModel.otpToken as string);

            if (!isValidOTP) {
                await OTP.deleteMany({ userId: user._id });
                return errorResponse(res, 'Invalid OTP', 400);
            }

            return successResponse(res, 'OTP is valid', {email, otpId: otpModel._id});
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }

    static async resetPassword(req:Request, res:Response) {
        try {
            const { password, confirmPassword } = req.body;
            const { email, otpId } = req.params;

            const requiredFields = ['password', 'confirmPassword'];

            const validationErrors = requiredFields.filter(field => !req.body[field]);

            if (validationErrors.length > 0) {
                const errorMessage = `The following fields are required: ${validationErrors.join(', ')}`;
                return errorResponse(res, errorMessage, 400);
            }

            if (password !== confirmPassword) return errorResponse(res, 'Password mismatch', 400);

            const user: IUser | null = await ConstantService.findModelByOne(User, { email });         

            if (!user) return errorResponse(res, 'user does not exist', 400);

            const otpModel: IOTP | null = await ConstantService.findModelById(OTP, otpId);

            if (!otpModel) return errorResponse(res, 'No OTP found', 400);

            const hashPassword = await hash(password);

            await Promise.all([
                User.updateOne({_id: user._id}, {$set: { password: hashPassword }}),
                OTP.deleteMany({ userId: user._id })
            ]);

            return successResponse(res, 'Password changed successfully');
        } catch (error: any) {
            return errorResponse(res, error.message, 500);
        }
    }
}

export default AuthController;