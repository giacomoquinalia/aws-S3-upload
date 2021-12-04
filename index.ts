/* eslint-disable @typescript-eslint/no-explicit-any */
import aws from 'aws-sdk'

// Adapt to the format the file comes in on request
// Adapte para o formato que o arquivo vem no request
interface IFile {
  filename: string
  mimetype: string
  enconding: string
  truncated: boolean
  content: Buffer
}

interface IStorageService {
  saveFile(file: IFile, key: string, acl?: string): Promise<void>
  getFile(key: string): Promise<{ [key: string]: unknown }>
  deleteFile(key: string): Promise<void>
}

// Prefer to get the information from .env
// Prefira pegar as informacoes do .env
const config = {
  bucket: 'awesome-bucket-name',
  region: 'us-east-1',
}

export class S3Storage implements IStorageService {
  private client: aws.S3

  constructor() {
    this.client = new aws.S3({
      region: config.region,
    })
  }

  public async getFile(key: string): Promise<any> {
    const result = await this.client
      .getObject({
        Bucket: config.bucket,
        Key: key,
      })
      .promise()

    return result
  }

  public async saveFile(file: IFile, key: string, acl?: string): Promise<void> {
    await this.client
      .putObject({
        Bucket: config.bucket,
        Key: key,
        Body: file.content,
        ContentType: file.mimetype,
        ACL: acl || 'public-read',
      })
      .promise()
  }

  public async deleteFile(key: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: config.bucket,
        Key: key,
      })
      .promise()
  }
}
