import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(dto: CreateProductDto, imageUrl?: string): Promise<Product> {
    const newProduct = new this.productModel({ ...dto, imageUrl });
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async update(
    id: string,
    dto: Partial<CreateProductDto>,
    imageUrl?: string,
  ): Promise<Product | null> {
    return this.productModel
      .findByIdAndUpdate(id, { ...dto, imageUrl }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }
}
