import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategoryBody.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { EditCategoryDto } from './dto/editCategoryBody.dto';
import { GetAllCategoriesQueryParamsDto, GetAllDeletedCategoriesQueryParamsDto } from './dto/queryParams.dto';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    createCategory(createCategoryDto: CreateCategoryDto): Promise<DefaultResponseDto>;
    getAllCategories(allCategoriesQueryParamsDto: GetAllCategoriesQueryParamsDto): Promise<DefaultResponseDto>;
    getAllDeletedCategories(allDeletedCategoriesQueryParamsDto: GetAllDeletedCategoriesQueryParamsDto): Promise<DefaultResponseDto>;
    getCategoryById(categoryId: number): Promise<DefaultResponseDto>;
    updateCategoryById(categoryId: number, editCategoryDto: EditCategoryDto): Promise<DefaultResponseDto>;
    deleteCategoryById(categoryId: number): Promise<DefaultResponseDto>;
    restoreDeletedCategoryById(categoryId: number): Promise<DefaultResponseDto>;
}
