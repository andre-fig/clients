import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('logs')
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  action: string;

  @Column()
  route: string;

  @Column()
  method: string;

  @Column('json', { nullable: true })
  params: Record<string, any>;

  @Column('json', { nullable: true })
  query: Record<string, any>;

  @Column('json', { nullable: true })
  body: Record<string, any>;

  @Column({ nullable: true })
  userId: string;

  @Column()
  statusCode: number;

  @Column('json', { nullable: true })
  response: Record<string, any>;

  @Column({ type: 'timestamp' })
  timestamp: Date;

  @Column({ type: 'int' })
  duration: number;
}
