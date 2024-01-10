import { DiscountService } from './discount.service';
import { CreateNewDiscountDto } from './dto/createDiscountBody.dto';
import { DefaultResponseDto } from 'src/common/dto/defaultResponse.dto';
import { EditDiscountDto } from './dto/editDiscountBody.dto';
import { GetAllDiscountsQueryParamsDto, GetDiscountsQueryParamsDto } from './dto/queryParams.dto';
export declare class DiscountController {
    private discountService;
    constructor(discountService: DiscountService);
    createNewDiscount(newDiscountDto: CreateNewDiscountDto): Promise<DefaultResponseDto>;
    getAllDiscounts(getAllDiscountsQueryParamsDto: GetAllDiscountsQueryParamsDto): Promise<DefaultResponseDto>;
    getAllActiveDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<DefaultResponseDto>;
    getAllInactiveDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<DefaultResponseDto>;
    getAllDeletedDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<DefaultResponseDto>;
    getDiscountById(discountId: number): Promise<DefaultResponseDto>;
    updateDiscountById(discountId: number, editDiscountDto: EditDiscountDto): Promise<DefaultResponseDto>;
    deleteDiscountById(discountId: number): Promise<DefaultResponseDto>;
    restoreDiscountById(discountId: number): Promise<DefaultResponseDto>;
    activateDiscountById(discountId: number): Promise<DefaultResponseDto>;
    inactivateDiscountById(discountId: number): Promise<DefaultResponseDto>;
}
