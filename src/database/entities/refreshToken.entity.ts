import { Entity, Column, PrimaryGeneratedColumn, OneToOne, BeforeInsert } from 'typeorm';
import { DbBaseEntity } from './db-base.entity';
import { User } from './user.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends DbBaseEntity {
  constructor(dto: Partial<RefreshToken>) {
    super();
    Object.assign(this, dto);
  }

  @Column()
  value: string;

  @OneToOne(type => User, user => user.refreshToken)
  user: User;

  @Column()
  expirionIn: Date;

  @BeforeInsert()
  setExpirionIn(){
    this.expirionIn = new Date();
  }
}
