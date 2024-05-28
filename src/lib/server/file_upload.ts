import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "~/env";

const REGION = "ru-central1";
const ENDPOINT = "https://storage.yandexcloud.net";
const s3Client = new S3Client({ region: REGION, endpoint: ENDPOINT });

export async function UploadFile(file: Buffer, key: string): Promise<void> {
  await s3Client.send(
    new PutObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: file
    })
  );
}

export async function GetSignedUrl(key: string): Promise<string> {
  return await getSignedUrl(
    s3Client,
    new GetObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key
    }),
    { expiresIn: 3600 }
  );
}

export async function ObjectExists(key: string): Promise<boolean> {
  const command = new GetObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key
  });
  try {
    await s3Client.send(command);
    return true;
  } catch (e) {
    return false;
  }
}

export async function DeleteObject(key: string): Promise<void> {
  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: env.S3_BUCKET,
      Key: key
    })
  );
}
