import { BadRequestException, Injectable } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class ApiService {
  async compressImage(file: Express.Multer.File) {
    try {
      const metadata = await sharp(file.buffer).metadata();
      const newWidth = Math.round(metadata.width / 2);
      const newHeight = Math.round(metadata.height / 2);

      const reducedFile = await sharp(file.buffer)
        .resize(newWidth, newHeight)
        .toBuffer();

      return reducedFile;
    } catch (error) {
      throw new BadRequestException(
        "Couldn't resize the image. Please ensure it's a valid image file.",
      );
    }
  }

  async compressPDF(file: Express.Multer.File) {
    console.log(file);

    return 'Compress PDF';
  }
}
