import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Enregistrer le plugin multipart pour gérer les fichiers
  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10000000, // Limite de taille de fichier (ici 10 Mo)
    },
  });

  // Serve the uploads folder as static
  app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();



import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyStatic from '@fastify/static';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement depuis le fichier .env
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Récupérer le chemin des uploads depuis les variables d'environnement
  const uploadsDir = path.resolve(
    __dirname,
    '..',
    process.env.UPLOADS_PATH || 'uploads',
  );

  // Enregistrer le plugin static pour servir les fichiers
  app.register(fastifyStatic, {
    root: uploadsDir, // Le répertoire où les fichiers sont stockés
    prefix: '/uploads/', // L'URL de base pour accéder aux fichiers
  });

  // Assurez-vous que le répertoire 'uploads' existe
  if (!require('fs').existsSync(uploadsDir)) {
    require('fs').mkdirSync(uploadsDir, { recursive: true });
  }

  await app.listen(3000);
}
bootstrap();
