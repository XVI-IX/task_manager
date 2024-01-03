import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class FutureDatePipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    value = new Date(value);
    if (value instanceof Date) {
      if (value > new Date()) {
        return value;
      }
    }

    throw new BadRequestException('Invalid date. Please provide a valid date');
  }
}
