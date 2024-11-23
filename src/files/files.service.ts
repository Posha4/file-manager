import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class FilesService {
  private readonly uploadDir = './uploads';

  getFilePath(filename: string): string {
    return join(this.uploadDir, filename);
  }
}
