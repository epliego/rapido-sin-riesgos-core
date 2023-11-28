import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('rsr_form_new_installation')
export class FormNewInstallationEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Establishment Name',
  })
  establishment_name: string;

  @Column({
    type: 'text',
    comment: 'Establishment Address',
  })
  establishment_address: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Establishment CP',
  })
  establishment_cp: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Establishment Locality',
  })
  establishment_locality: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Establishment Province',
  })
  establishment_province: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Establishment Province',
  })
  establishment_sector: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Contact Person Full Name',
  })
  contact_person_full_name: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Contact Person Phone',
  })
  contact_person_phone: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Contact Person Email',
  })
  contact_person_email: string;

  @Column({
    type: 'int',
    width: 1,
    comment: '0 = cashier, 1 = dataphone',
    default: 1,
  })
  terminal_type: number;

  @Column({
    type: 'double',
    comment: 'Commission',
  })
  commission: number;

  @Column({
    type: 'int',
    width: 1,
    comment: '0 = No, 1 = Yes',
    default: 1,
  })
  retribution: number;

  @Column({
    type: 'double',
    comment: 'Initial Fund',
  })
  fund_initial: number;

  @Column({
    type: 'int',
    width: 1,
    comment: '0 = client, 1 = us',
    default: 1,
  })
  fund_contribution: number;

  @Column({
    type: 'int',
    width: 1,
    comment: '0 = loomis, 1 = wire transfer, 2 = card',
    default: 1,
  })
  replenishment_method: number;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Company Name',
  })
  company_name: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Company CIF',
  })
  company_cif: string;

  @Column({
    type: 'text',
    comment: 'Company Fiscal Address',
  })
  company_fiscal_address: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Company CP',
  })
  company_cp: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Company Locality',
  })
  company_locality: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Company Province',
  })
  company_province: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Administrator Name',
  })
  administrator_name: string;

  @Column({
    type: 'varchar',
    width: 255,
    comment: 'Administrator DNI',
  })
  administrator_dni: string;

  @Column({
    type: 'int',
    width: 1,
    comment: 'Active register boolean atribute',
    default: 1,
  })
  active: number;

  @Column({
    type: 'timestamp',
    comment: 'Insert Date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  insert_date: Date;

  @Column({
    type: 'int',
    width: 11,
    comment: 'User that inserted the registry',
    nullable: true,
  })
  insert_by: number;

  @Column({
    type: 'timestamp',
    comment: 'Update Date',
    nullable: true,
  })
  update_date: Date;

  @Column({
    type: 'int',
    width: 11,
    comment: 'User that updated the registry',
    nullable: true,
  })
  update_by: number;
}
