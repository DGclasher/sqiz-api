import * as sharp from 'sharp';
import * as gs from 'ghostscript-node';
import { BadRequestException, Injectable } from '@nestjs/common';

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
    try {
      const compressedPDF = await gs.compressPDF(file.buffer);
      return compressedPDF;
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        "Couldn't resize the PDF. Please ensure it's a valid PDF file.",
      );
    }
  }
}
