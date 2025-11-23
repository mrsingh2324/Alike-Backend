import bcrypt from "bcryptjs";

export const generateNumericOtp = (length = 6): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const hashOtp = async (otp: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(otp, salt);
};

export const verifyOtpHash = (otp: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(otp, hash);
};
