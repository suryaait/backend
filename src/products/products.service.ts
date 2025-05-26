import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(
    dto: CreateProductDto,
    imageUrl?: string,
    imageUrls?: string[],
  ): Promise<Product> {
    const newProduct = new this.productModel({
      ...dto,
      stock: dto.stock ?? 0,
      imageUrl,
      imageUrls,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
    });
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findOne(id: string): Promise<Product | null> {
    return this.productModel.findById(id).exec();
  }

  async update(id: string, dto: UpdateProductDto, imageUrls?: string[]) {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (imageUrls && imageUrls.length) {
      product.imageUrls = imageUrls;
    }

    product.stock = dto.stock ?? 0;

    Object.assign(product, dto);

    return await product.save();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return { deleted: !!result };
  }

  async filter(
    filters: any,
    sortBy?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    let query = this.productModel.find(filters);

    if (sortBy) {
      const sort: Record<string, 1 | -1> = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
      query = query.sort(sort);
    }

    return query.exec();
  }
}
