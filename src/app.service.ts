import { HttpStatus, Injectable, Res } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RequestGenerateQrDto } from './dto/request/request-generate-qr-dto';
import { RequestGenerateFormNewInstalationDto } from './dto/request/request-generate-form-new-instalation-dto';
import { FormNewInstallationEntity } from './entities/form-new-installation.entity';
import * as fs from 'fs';
import { PDFDocument } from 'pdf-lib';
import QRCode = require('easyqrcodejs-nodejs');

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(FormNewInstallationEntity)
    private readonly formNewInstallationRepository: Repository<FormNewInstallationEntity>,
    private readonly httpService: HttpService,
  ) {}

  // getHello(): string {
  //   return 'Hello World!';
  // }

  /**
   * Function Generate QR Rapido sin Riesgos
   * @param parameters
   * @param response
   */
  async generateQrService(
    parameters: RequestGenerateQrDto,
    @Res() response: any,
  ) {
    try {
      const url_generarqr =
        process.env.RAPIDPREST_URL_BASE_API +
        'maq1/generarqr/' +
        process.env.RAPIDPREST_MACHINE_CODE;

      const headers_generarqr = {
        // Consulted (11-2023) in: https://stackoverflow.com/questions/52972616/add-headers-httprequest-in-nestjs
        Authorization: 'Bearer ' + process.env.RAPIDPREST_API_KEY,
      };

      const body_generarqr = {
        cantidad: parameters.quantity,
        numeroautorizacion: parameters.authorization_number,
      };

      await this.httpService.axiosRef
        .post(url_generarqr, body_generarqr, { headers: headers_generarqr })
        .then(async (res_generarqr) => {
          // console.log(res_generarqr);
          if (parseInt(res_generarqr.data.state) === 200) {
            // QR - START
            const options = {
              // ====== Basic
              text: res_generarqr.data.data.codigo,
              width: 520,
              height: 520,
              colorDark: '#000000',
              colorLight: '#FFFFFF',
              correctLevel: QRCode.CorrectLevel.H,
              // ====== dotScale
              dotScale: 1,
              // ====== Quiet Zone
              quietZone: 10,
              quietZoneColor: 'rgba(0,0,0,0)',
            };

            const qrcode = new QRCode(options);

            qrcode
              .toDataURL()
              .then(async (data: any) => {
                // console.info('======QRCode PNG Base64 DataURL======');
                // console.info(data);

                response.status(HttpStatus.OK).json({
                  status: parseInt(res_generarqr.data.state),
                  message: ['Generate QR successfully'],
                  data: [
                    {
                      qr_base64: data,
                    },
                  ],
                });
              })
              .catch(async (error: any) => {
                console.log(error);
              });
            // QR - END
          } else {
            response.status(HttpStatus.BAD_REQUEST).json({
              status: parseInt(res_generarqr.data.state),
              message: [res_generarqr.data.message],
              data: [],
            });
          }
        })
        .catch(async (err) => {
          console.log(err);

          response.status(HttpStatus.BAD_REQUEST).json({
            status: err.response.status,
            message: [err.response.data.message],
            error: err.response.statusText,
          });
        });
    } catch (err) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: ['Error in service Generate QR'],
        error: err.message,
      });
    }
  }

  /**
   * Function Generate Form New Installation Rapido sin Riesgos
   * @param parameters
   * @param response
   */
  async generateFormNewInstallationService(
    parameters: RequestGenerateFormNewInstalationDto,
    @Res() response: any,
  ) {
    try {
      const json_form_new_installation =
        await this.formNewInstallationRepository.findOne({
          where: {
            id: parameters.form_new_instalation_id,
          },
        });
      if (!json_form_new_installation) {
        response.status(HttpStatus.BAD_REQUEST).json({
          status: 400,
          message: ["Form New Installation doesn't exist"],
          error: 'Bad Request',
        });
      } else {
        const insert_date = new Date(json_form_new_installation.insert_date)
          .toISOString()
          .slice(0, 10)
          .replace('T', ' ');

        fs.readFile(
          './files/downloads/formulario_nueva_instalacion_freelancer.pdf',
          async function (e, file) {
            // Consulted (08-2020) in: https://stackoverflow.com/questions/31712043/how-to-upload-a-binary-body-with-a-put-request-in-node-js-using-needle-or-reques
            if (e) {
              console.log(e.message);

              throw e;
            }

            const pdfDoc = await PDFDocument.load(file); // Consulted (11-2023) in: https://www.npmjs.com/package/pdf-lib?activeTab=readme#fill-form, https://stackoverflow.com/questions/2127878/extract-pdf-form-field-names-from-a-pdf-form

            const form = pdfDoc.getForm();

            const date_field = form.getTextField('Fecha');
            const establishment_name_field = form.getTextField(
              'Nombre establecimiento',
            );
            const establishment_address_field = form.getTextField('Dirección');
            const establishment_cp_field = form.getTextField('CP');
            const establishment_locality_field = form.getTextField('Localidad');
            const establishment_province_field = form.getTextField('Provincia');
            const contact_person_full_name_field =
              form.getTextField('Persona contacto');
            const contact_person_phone_field =
              form.getTextField('Teléfono contacto');
            const contact_person_email_field = form.getTextField('email');
            const establishment_sector_field =
              form.getTextField('Sector actividad');

            let terminal_type_field = form.getCheckBox('Check datáfono');
            if (json_form_new_installation.terminal_type === 0) {
              terminal_type_field = form.getCheckBox('Check Cajero');
            }

            const commission_field = form.getTextField('comisión');

            const retribution_field = form.getRadioGroup('Retorno grupo');
            let retribution = 'Sí';
            if (json_form_new_installation.retribution === 0) {
              retribution = 'NO';
            }

            const fund_initial_field = form.getTextField('Fondo inicial');

            const fund_contribution_field = form.getRadioGroup(
              'Aportacion fondo grupo',
            );
            let fund_contribution = 'Nosotros';
            if (json_form_new_installation.fund_contribution === 0) {
              fund_contribution = 'Cliente';
            }

            const replenishment_method_field = form.getRadioGroup(
              'Método reposición grupo',
            );
            let replenishment_method = 'Loomis';
            if (json_form_new_installation.replenishment_method === 1) {
              replenishment_method = 'Transferencia';
            } else if (json_form_new_installation.replenishment_method === 2) {
              replenishment_method = 'Tarjeta';
            }

            const company_name_field = form.getTextField('Nombre empresa');
            const company_cif_field = form.getTextField('CIF');
            const company_fiscal_address_field =
              form.getTextField('Dirección Fiscal');
            const company_cp_field = form.getTextField('CP 2');
            const company_locality_field = form.getTextField('Localidad 2');
            const company_province_field = form.getTextField('Provincia 2');
            const administrator_name_field = form.getTextField(
              'Nombre administrador',
            );
            const administrator_dni_field =
              form.getTextField('DNI administrador');

            date_field.setText(insert_date);
            establishment_name_field.setText(
              json_form_new_installation.establishment_name,
            );
            establishment_address_field.setText(
              json_form_new_installation.establishment_address,
            );
            establishment_cp_field.setText(
              json_form_new_installation.establishment_cp,
            );
            establishment_locality_field.setText(
              json_form_new_installation.establishment_locality,
            );
            establishment_province_field.setText(
              json_form_new_installation.establishment_province,
            );
            contact_person_full_name_field.setText(
              json_form_new_installation.contact_person_full_name,
            );
            contact_person_phone_field.setText(
              json_form_new_installation.contact_person_phone,
            );
            contact_person_email_field.setText(
              json_form_new_installation.contact_person_email,
            );
            establishment_sector_field.setText(
              json_form_new_installation.establishment_sector,
            );
            terminal_type_field.check();
            commission_field.setText(
              String(json_form_new_installation.commission),
            );
            retribution_field.select(retribution);
            fund_initial_field.setText(
              String(json_form_new_installation.fund_initial),
            );
            fund_contribution_field.select(fund_contribution);
            replenishment_method_field.select(replenishment_method);
            company_name_field.setText(json_form_new_installation.company_name);
            company_cif_field.setText(json_form_new_installation.company_cif);
            company_fiscal_address_field.setText(
              json_form_new_installation.company_fiscal_address,
            );
            company_cp_field.setText(json_form_new_installation.company_cp);
            company_locality_field.setText(
              json_form_new_installation.company_locality,
            );
            company_province_field.setText(
              json_form_new_installation.company_province,
            );
            administrator_name_field.setText(
              json_form_new_installation.administrator_name,
            );
            administrator_dni_field.setText(
              json_form_new_installation.administrator_dni,
            );

            const pdf_bytes = await pdfDoc.save();

            const create_file = fs.createWriteStream(
              './files/uploads/formulario_nueva_instalacion_freelancer_' +
                parameters.form_new_instalation_id +
                '.pdf',
            );
            create_file.write(pdf_bytes); // Consulted (11-2023) in: https://gist.github.com/bberak/4ab2abee49e5f3e7be3143415e52bae5
            create_file.end(() => {
              fs.readFile(
                './files/uploads/formulario_nueva_instalacion_freelancer_' +
                  parameters.form_new_instalation_id +
                  '.pdf',
                async function (e_base64, file_base64) {
                  if (e) {
                    console.log(e_base64.message);

                    throw e_base64;
                  }

                  response.status(HttpStatus.OK).json({
                    status: 200,
                    message: ['Generate Form New Installation successfully'],
                    data: [
                      {
                        file_base64:
                          'data:application/pdf;base64,' +
                          file_base64.toString('base64'),
                      },
                    ],
                  });

                  fs.unlinkSync(
                    './files/uploads/formulario_nueva_instalacion_freelancer_' +
                      parameters.form_new_instalation_id +
                      '.pdf',
                  );
                },
              );
            });
          },
        );
      }
    } catch (err) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: ['Error in service Generate Form New Installation'],
        error: err.message,
      });
    }
  }

  /**
   * Function List Form New Installation Rapido sin Riesgos
   * @param response
   */
  async listFormNewInstallationService(@Res() response: any) {
    try {
      response.status(HttpStatus.OK).json({
        status: 200,
        message: ['List Form New Installation successfully'],
        data: await this.formNewInstallationRepository.find(),
      });
    } catch (err) {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 500,
        message: ['Error in service List Form New Installation'],
        error: err.message,
      });
    }
  }
}
