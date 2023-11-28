import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestGenerateFormNewInstalationDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly form_new_instalation_id: number;
}
