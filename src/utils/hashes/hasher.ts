import { hash as bcryptHash, compare as bcryptCompare, genSalt as bcryptGenSalt } from 'bcryptjs';

export const hash = async (value: string): Promise<string> => {
  const salt = await bcryptGenSalt(10);
  return bcryptHash(value, salt);
};

export const compare = async (value: string, hash: string): Promise<boolean> => {
  return bcryptCompare(value, hash);
};

export const generateRandomOTP = (): number => {
  return Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
};