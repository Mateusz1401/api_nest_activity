import { Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

export abstract class DbBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  createdOn: Date;

  @Column({ nullable: true })
  modifiedOn: Date;

  @BeforeInsert()
  setCreatedOn() {
    this.createdOn = new Date();
  }

  @BeforeUpdate()
  setModifiedOn() {
    this.modifiedOn = new Date();
  }
}
