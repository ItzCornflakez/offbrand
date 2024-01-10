import { ProductService } from './product.service';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { CreateProductBodyDto, CreateInventoryBodyDto } from './dto/productAndInventory.dto';
import { GetAllProductsQueryParamsDto, GetProductsQueryParamsDto } from './dto/queryParams.dto';
import { EditProductBodyDto } from './dto/editProductBody.dto';
export declare class ProductController {
    private productService;
    constructor(productService: ProductService);
    createNewProduct(newProductBodyDto: CreateProductBodyDto): Promise<DefaultResponseDto>;
    addNewInventoryToProductById(productId: number, newInventoryBodyDto: CreateInventoryBodyDto): Promise<DefaultResponseDto>;
    getAllProducts(getAllProductsQueryParamsDto: GetAllProductsQueryParamsDto): Promise<DefaultResponseDto>;
    getAllDeletedProducts(getProductsQueryParamsDto: GetProductsQueryParamsDto): Promise<DefaultResponseDto>;
    getProductsByCategoryId(categoryId: number, getProductsQueryParamsDto: GetProductsQueryParamsDto): Promise<DefaultResponseDto>;
    getProductsByDiscountId(discountId: number, getProductsQueryParamsDto: GetProductsQueryParamsDto): Promise<DefaultResponseDto>;
    getProductById(productId: number): Promise<DefaultResponseDto>;
    getInventoriesRelatedToProduct(productId: number): Promise<DefaultResponseDto>;
    updateProductById(productId: number, editProductBodyDto: EditProductBodyDto): Promise<DefaultResponseDto>;
    addProductToCategoryById(productId: number, categoryId: number): Promise<DefaultResponseDto>;
    removeProductToCategoryById(productId: number, categoryId: number): Promise<DefaultResponseDto>;
    setDiscountOnProduct(productId: number, discountId: number): Promise<DefaultResponseDto>;
    removeDiscountFromProductById(productId: number): Promise<DefaultResponseDto>;
    deleteProductById(productId: number): Promise<DefaultResponseDto>;
    restoreProductById(productId: number): Promise<DefaultResponseDto>;
}
