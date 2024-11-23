import { Controller, Post, Req } from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import * as path from 'path';
import * as fs from 'fs';

@Controller('files')
export class FilesController {
  @Post('upload')
  async uploadFile(@Req() req: FastifyRequest) {
    // Utiliser req.file() pour récupérer le fichier
    const file = await req.file();

    if (!file) {
      throw new Error('No file uploaded');
    }

    // Définir le chemin de stockage
    const uploadDir = path.resolve(__dirname, '..', 'uploads');
    const uploadPath = path.join(uploadDir, file.filename);

    // Vérifier si le répertoire existe, sinon le créer
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Créer un flux pour écrire le fichier sur le disque
    const writeStream = fs.createWriteStream(uploadPath);
    file.file.pipe(writeStream);

    // Attendre la fin de l'écriture
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    return {
      message: 'File uploaded successfully',
      fileName: file.filename,
      fileUrl: `http://localhost:3000/uploads/${file.filename}`, // URL du fichier
    };
  }
}
