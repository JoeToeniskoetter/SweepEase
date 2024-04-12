import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Injectable()
export class UploadService {
  private bucketName: string;
  private minioClient: Client;
  constructor(private configService: ConfigService) {
    const config = {
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      useSSL: false,
      accessKey: this.configService.get('MINIO_ACCESSKEY'),
      secretKey: this.configService.get('MINIO_SECRETKEY'),
      port: parseInt(this.configService.get('MINIO_PORT')),
    };
    this.minioClient = new Client(config);
    this.bucketName = this.configService.get('MINIO_BUCKET');
  }

  async upload(file: Express.Multer.File, pathPrefix: string): Promise<string> {
    const path = `${pathPrefix}/${file.originalname}`;
    try {
      await this.minioClient.putObject(
        this.configService.get('MINIO_BUCKET'),
        path,
        file.buffer,
        file.size,
      );
      return path;
    } catch (e) {
      console.log(e);
    }
  }

  async getUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
    );
  }
}
