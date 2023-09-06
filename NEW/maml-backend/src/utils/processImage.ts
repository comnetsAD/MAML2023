import sharp from "sharp";
import fs from "fs";
import path from "path";
import { IMAGE_QUALITY, SOURCE_WIDTH, THUMBNAIL_WIDTH } from "./constants";
import { randomString } from "./randomString";
import Logger from "./logger";
import AWS from "aws-sdk";

export const processImage = async (file: Express.Multer.File) => {
  // if (process.env.NODE_ENV === "dev") {
  //   return Array(2).fill(
  //     `http://localhost:${process.env.SERVER_PORT}/public/sample.jpg`
  //   );
  // }

  const sharpSource = sharp(file.path);
  const thumbnail = sharpSource.clone().resize(THUMBNAIL_WIDTH);
  const source = sharpSource.clone().resize(SOURCE_WIDTH);

  const [sourceFilename, thumbnailFilename] = [randomString(), randomString()];

  const sourceFolderPath = path.join("public", "source");
  const thumbnailFolderPath = path.join("public", "thumbnail");

  if (!fs.existsSync(sourceFolderPath)) {
    fs.mkdirSync(sourceFolderPath, { recursive: true });
  }

  if (!fs.existsSync(thumbnailFolderPath)) {
    fs.mkdirSync(thumbnailFolderPath, { recursive: true });
  }

  const sourceFilePath = `${sourceFolderPath}/${sourceFilename}.jpg`;
  const thumbnailFilePath = `${thumbnailFolderPath}/${thumbnailFilename}.jpg`;

  await Promise.all([
    source.jpeg({ quality: IMAGE_QUALITY }).toFile(sourceFilePath),
    thumbnail.jpeg({ quality: IMAGE_QUALITY }).toFile(thumbnailFilePath)
  ]);

  if (process.env.NODE_ENV === "prod") {
    const s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    const sourceBlob = fs.readFileSync(sourceFilePath);
    const sourceImage = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME || "maml-images",
        Key: `source/${sourceFilename}.jpg`,
        Body: sourceBlob
      })
      .promise();

    const thumbnailBlob = fs.readFileSync(thumbnailFilePath);
    const thumbnailImage = await s3
      .upload({
        Bucket: process.env.AWS_BUCKET_NAME || "maml-images",
        Key: `thumbnail/${thumbnailFilename}.jpg`,
        Body: thumbnailBlob
      })
      .promise();

    clearTempFile(file.path);
    clearTempFile(sourceFilePath);
    clearTempFile(thumbnailFilePath);
    return [sourceImage, thumbnailImage].map((image) => image.Location);
  }

  return [
    `http://localhost:${process.env.SERVER_PORT}/public/source/${sourceFilename}.jpg`,
    `http://localhost:${process.env.SERVER_PORT}/public/thumbnail/${thumbnailFilename}.jpg`
  ];
};

export const clearTempFile = (filepath: string) => {
  fs.unlink(filepath, (err) => {
    if (err) {
      Logger.error(err);
    }
  });
};
