import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString, IsOptional, IsBoolean, IsEmpty } from 'class-validator';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @Column({ length: 500 })
  name: string;

  @IsString()
  @Column('text')
  description: string;

  @IsString()
  @Column()
  filename: string;

  @IsNumber()
  @Column('int')
  views: number;

  @IsBoolean()
  @Column()
  isPublished: boolean;
}