import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientOptions } from 'minio';

@Injectable()
export class UploadService {
  private bucketName: string;
  private minioClient: Client;
  constructor(private configService: ConfigService) {
    const config: ClientOptions = {
      endPoint: this.configService.get('MINIO_ENDPOINT'),
      useSSL: this.configService.get('NODE_ENV') !== 'development',
      accessKey: this.configService.get('MINIO_ACCESSKEY'),
      secretKey: this.configService.get('MINIO_SECRETKEY'),
    };
    const port = this.configService.get('MINIO_PORT');
    if (port) {
      config.port = +port;
    }
    this.minioClient = new Client(config);
    this.bucketName = this.configService.get('MINIO_BUCKET');
  }

  async upload(file: Express.Multer.File, pathPrefix: string): Promise<string> {
    const path = `${pathPrefix}/${file.originalname}`;
    await this.minioClient.putObject(
      this.configService.get('MINIO_BUCKET'),
      path,
      file.buffer,
      file.size,
    );
    return path;
  }

  async getUrl(fileName: string) {
    return await this.minioClient.presignedUrl(
      'GET',
      this.bucketName,
      fileName,
      36000,
    );
  }
}
