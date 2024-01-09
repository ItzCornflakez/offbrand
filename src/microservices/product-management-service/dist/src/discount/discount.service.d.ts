import { PrismaService } from '../prisma/prisma.service';
import { CreateNewDiscountDto } from './dto/createDiscountBody.dto';
import { EditDiscountDto } from './dto/editDiscountBody.dto';
import { GetAllDiscountsQueryParamsDto, GetDiscountsQueryParamsDto } from './dto/queryParams.dto';
export declare class DiscountService {
    private prismaService;
    constructor(prismaService: PrismaService);
    createNewDiscount(newDiscountDto: CreateNewDiscountDto): Promise<any>;
    getAllDiscounts(getAllDiscountsQueryParamsDto: GetAllDiscountsQueryParamsDto): Promise<{
        discounts: any;
        totalEntries: any;
    }>;
    getDiscountById(discountId: number): Promise<any>;
    getAllActiveDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<{
        activeDiscounts: any;
        totalEntries: any;
    }>;
    getAllInactiveDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<{
        inactiveDiscounts: any;
        totalEntries: any;
    }>;
    getAllDeletedDiscounts(getDiscountQueryParamsDto: GetDiscountsQueryParamsDto): Promise<{
        deletedDisounts: any;
        totalEntries: any;
    }>;
    updateDiscountById(discountId: number, editDiscountDto: EditDiscountDto): Promise<any>;
    deleteDiscountById(discountId: number): Promise<void>;
    restoreDiscountById(discountId: number): Promise<void>;
    activateDiscountById(discountId: number): Promise<any>;
    inactivateDiscountById(discountId: number): Promise<any>;
}
