import { UserRole } from '@/enums';
import { User } from '@/features/auth/type/auth.type';
import { comparePassword, hashPassword } from '@/utils';
import { Document, model, Schema } from 'mongoose';

export interface UserDocument extends Document, Omit<User, '_id'> {
  comparePassword(password: string): Promise<boolean>;
}

export const UserSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },
    avatar: {
      type: String,
    },
    fiqh: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    code: {
      otp: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

UserSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    this.password = await hashPassword(this.password);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return comparePassword(password, this.password);
};

export const UserModel = model<UserDocument>('User', UserSchema);
