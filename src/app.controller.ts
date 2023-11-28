import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { AppService } from './app.service';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseEmptyDto } from './dto/response/response-empty-dto';
import { RequestGenerateQrDto } from './dto/request/request-generate-qr-dto';
import { RequestGenerateFormNewInstalationDto } from './dto/request/request-generate-form-new-instalation-dto';

@Controller('v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  /**
   * Generate QR Rapido sin Riesgos
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'Generate QR Rapido sin Riesgos',
  })
  @ApiOkResponse({
    description: 'Generate QR successfully',
    type: ResponseEmptyDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Bad Request:<br/>' +
      '1.- authorization_number must be a string<br/>' +
      '2.- quantity must be a number conforming to the specified constraints',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Error in service Generate QR',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('generate-qr')
  async generateQr(
    @Body() parameters: RequestGenerateQrDto,
    @Res() response: any,
  ): Promise<any> {
    return await this.appService.generateQrService(parameters, response);
  }

  /**
   * Generate Form New Installation Rapido sin Riesgos
   * @param parameters
   * @param response
   */
  @ApiOperation({
    summary: 'Generate Form New Installation Rapido sin Riesgos',
  })
  @ApiOkResponse({
    description: 'Generate Form New Installation successfully',
    type: ResponseEmptyDto,
  })
  @ApiBadRequestResponse({
    status: 400,
    description:
      'Bad Request:<br/>' +
      "1.- Form New Installation doesn't exist<br/>" +
      '1.- form_new_instalation_id must be a number conforming to the specified constraints',
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Error in service Generate Form New Installation',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('generate-form-new-installation')
  async generateFormNewInstallation(
    @Body() parameters: RequestGenerateFormNewInstalationDto,
    @Res() response: any,
  ): Promise<any> {
    return await this.appService.generateFormNewInstallationService(
      parameters,
      response,
    );
  }

  /**
   * List Form New Installation Rapido sin Riesgos
   * @param response
   */
  @ApiOperation({
    summary: 'List Form New Installation Rapido sin Riesgos',
  })
  @ApiOkResponse({
    description: 'List Form New Installation successfully',
    type: ResponseEmptyDto,
  })
  @ApiInternalServerErrorResponse({
    status: 500,
    description: 'Error in service List Form New Installation',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Get('list-form-new-installation')
  async listFormNewInstallation(@Res() response: any): Promise<any> {
    return await this.appService.listFormNewInstallationService(response);
  }
}
