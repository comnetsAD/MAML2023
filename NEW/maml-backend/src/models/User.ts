import { model, Schema, Types } from "mongoose";
import validator from "validator";

export interface GAuth {
  credential: string;
}

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  picture: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minLength: 6,
      validate: validator.isEmail
    },
    name: {
      type: String,
      required: true,
      minLength: 3
    },
    picture: {
      type: String,
      validator: validator.isURL,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<IUser>("users", UserSchema);
