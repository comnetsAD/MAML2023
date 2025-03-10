import { model, Schema, Types } from "mongoose";
import validator from "validator";

export interface IPage {
  _id: Types.ObjectId;
  userID: Types.ObjectId;
  url: string;
  mamlFileContent: string;
  translateDuration: number;
}

const PageSchema = new Schema<IPage>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true
    },
    url: {
      type: String,
      required: true,
      minLength: 5
    },
    mamlFileContent: {
      type: String,
      required: true,
      minLength: 1
    },
    translateDuration: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model<IPage>("pages", PageSchema);
