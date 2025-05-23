/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + extname(file.originalname));
  },
});

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload-single')
  @UseInterceptors(FileInterceptor('image', { storage }))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateProductDto,
  ) {
    const imageUrl = `/uploads/${file.filename}`;
    const product = await this.productsService.create(dto, imageUrl);
    return {
      message: 'Product created with single image',
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('images', 5, { storage }))
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() dto: CreateProductDto,
  ) {
    const imageUrls = files.map((file) => `/uploads/${file.filename}`);
    const product = await this.productsService.create(
      dto,
      undefined,
      imageUrls,
    );
    return {
      message: 'Product created with multiple images',
      data: product,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('filter')
  async filterProducts(
    @Query('name') name?: string,
    @Query('createdFrom') createdFrom?: string,
    @Query('createdTo') createdTo?: string,
    @Query('inStock') inStock?: string,
  ) {
    const filters: Record<string, any> = {};

    if (name) {
      filters.name = { $regex: name, $options: 'i' };
    }

    if (createdFrom || createdTo) {
      filters.createdAt = {};
      if (createdFrom) {
        filters.createdAt.$gte = new Date(createdFrom + 'T00:00:00.000Z');
      }
      if (createdTo) {
        filters.createdAt.$lte = new Date(createdTo + 'T23:59:59.999Z');
      }
    }

    if (inStock !== undefined) {
      filters.stock = inStock === 'true' ? { $gt: 0 } : { $lte: 0 };
    }

    const results = await this.productsService.filter(filters);
    return {
      message: 'Filtered products',
      data: results,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.productsService.remove(id);
    return {
      message: result.deleted ? 'Deleted successfully' : 'Product not found',
    };
  }
}
