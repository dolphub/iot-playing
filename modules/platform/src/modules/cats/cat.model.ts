import mongoose, { Document } from 'mongoose';
import { IsString, IsNumber } from 'class-validator';

export const CatSchema = new mongoose.Schema({
  name: String,
  age: Number,
  breed: String,
});

export interface Cat extends Document {
  name: String,
  age: Number,
  breed: String,
}

export class CatDTO {
  @IsString()
  public name: String;

  @IsNumber()
  public age: Number;

  @IsString()
  public breed: String;
}