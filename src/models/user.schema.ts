import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, model } from 'mongoose';

export type UserDocument = HydratedDocument<User>

// схема пользователя
@Schema()
export  class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;
};

export const UserSchema = SchemaFactory.createForClass(User);