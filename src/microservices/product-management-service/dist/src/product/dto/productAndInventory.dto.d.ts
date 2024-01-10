export declare class CreateInventoryBodyDto {
    color: string;
    quantity: number;
}
export declare class CreateProductBodyDto {
    name: string;
    category_id: number;
    discount_id?: number;
    desc: string;
    price: number;
    picture: string;
    inventories: CreateInventoryBodyDto[];
}
