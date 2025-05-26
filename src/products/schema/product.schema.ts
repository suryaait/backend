import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  imageUrl?: string;

  @Prop({ default: 0 })
  stock: number;

  @Prop({ type: [String], default: [] })
  imageUrls?: string[];

  @Prop()
  createdAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
