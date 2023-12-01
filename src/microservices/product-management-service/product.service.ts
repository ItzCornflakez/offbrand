import {Injectable} from '@nestjs/common';

import {Product} from './product.model';

@Injectable()
export class ProductsService{
    products: Product[] = [];


    insertProduct(
        category_id: number, name: string,
        desc: string, price: number, discount: number,
        picture: string, average_score: string, is_deleted: boolean,
        created_at: string, updated_at: string) {
            return category_id;
            // TODO -- FIX THIS
        }
}