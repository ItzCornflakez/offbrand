import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class UserController {
  constructor(private productService: ProductService) {}
}
