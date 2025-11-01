// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  accessLevel: "admin" | "member";
  status: "active" | "deactivated";
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessLevel: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
      set: (v: string) => v.toLowerCase(),
    },
    status: {
      type: String,
      enum: ["active", "deactivated"],
      default: "active",
    },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
