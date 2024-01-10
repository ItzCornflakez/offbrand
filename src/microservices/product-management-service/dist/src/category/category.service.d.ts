import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/createCategoryBody.dto';
import { EditCategoryDto } from './dto/editCategoryBody.dto';
import { GetAllCategoriesQueryParamsDto, GetAllDeletedCategoriesQueryParamsDto } from './dto/queryParams.dto';
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<any>;
    getAllCategories(allCategoriesQueryParamsDto: GetAllCategoriesQueryParamsDto): Promise<{
        categories: any;
        totalEntries: any;
    }>;
    getCategoryById(categoryId: number): Promise<any>;
    getAllDeletedCategories(allDeletedCategoriesQueryParamsDto: GetAllDeletedCategoriesQueryParamsDto): Promise<{
        deletedCategories: any;
        totalEntries: any;
    }>;
    updateCategoryById(categoryId: number, editCategoryDto: EditCategoryDto): Promise<any>;
    deleteCategoryById(categoryId: number): Promise<void>;
    restoreDeletedCategoryById(categoryId: number): Promise<void>;
}
