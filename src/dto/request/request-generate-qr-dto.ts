import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestGenerateQrDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly authorization_number: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly quantity: number;
}
