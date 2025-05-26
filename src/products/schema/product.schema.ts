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

  @Prop({ type: [String], default: [] })
  imageUrls?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
