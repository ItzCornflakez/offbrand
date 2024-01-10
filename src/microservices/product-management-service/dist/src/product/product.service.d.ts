import { PrismaService } from '../prisma/prisma.service';
import { CreateInventoryBodyDto, CreateProductBodyDto } from './dto/productAndInventory.dto';
import { GetAllProductsQueryParamsDto, GetProductsQueryParamsDto } from './dto/queryParams.dto';
import { EditProductBodyDto } from './dto/editProductBody.dto';
export declare class ProductService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createNewProduct(newProductDto: CreateProductBodyDto): Promise<any>;
    addNewInvetoryToProductById(productId: number, createInventoryBodyDto: CreateInventoryBodyDto): Promise<any>;
    getAllProducts(getAllProductsQueryParamsDto: GetAllProductsQueryParamsDto): Promise<{
        products: any;
        totalEntries: any;
    }>;
    getAllDeletedProducts(getProductsQueryParamsDto: GetProductsQueryParamsDto): Promise<{
        products: any;
        totalEntries: any;
    }>;
    getProductById(productId: number): Promise<any>;
    getProductsByCategoryId(categoryId: number, getProductsQueryParamsDto: GetAllProductsQueryParamsDto): Promise<{
        products: any;
        totalEntries: any;
    }>;
    getProductsByDiscountId(discountId: number, getProductsQueryParamsDto: GetAllProductsQueryParamsDto): Promise<{
        products: any;
        totalEntries: any;
    }>;
    getInventoriesByProductId(productId: number): Promise<any>;
    updateProductById(productId: number, editProductBodyDto: EditProductBodyDto): Promise<any>;
    addProductToCategoryById(productId: number, categoryId: number): Promise<any>;
    removeProductFromCategoryById(productId: number, categoryId: number): Promise<void>;
    applyDiscountOnProductById(productId: number, discountId: number): Promise<any>;
    removeDiscountFromProductById(productId: number): Promise<any>;
    deleteProductById(productId: number): Promise<void>;
    restoreProductById(productId: number): Promise<void>;
}
