import {
  Res,
  Post,
  HttpStatus,
  Controller,
  UploadedFile,
  HttpException,
  UseInterceptors,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { ApiService } from './api.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidator } from 'src/app.validators';
import { Response as ExpressResponse } from 'express';
const MAX_FILE_SIZE = 5_000_000; // 5 MB
const VALID_IMAGE_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];
const VALID_PDF_TYPES = ['application/pdf'];

@Controller('api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('compress/image')
  @UseInterceptors(FileInterceptor('image'))
  async compressImage(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({ fileType: VALID_IMAGE_TYPES }),
        )
        .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Res() res: ExpressResponse,
  ) {
    try {
      const fileBuffer = await this.apiService.compressImage(file);
      res
        .status(HttpStatus.OK)
        .set('Content-Type', file.mimetype)
        .send(fileBuffer);
    } catch (error) {
      throw new HttpException(
        {
          error: 'File could not be resized',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  @Post('compress/pdf')
  @UseInterceptors(FileInterceptor('pdf'))
  async compressPDF(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({ fileType: VALID_PDF_TYPES }),
        )
        .addMaxSizeValidator({ maxSize: MAX_FILE_SIZE })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return this.apiService.compressPDF(file);
  }
}
