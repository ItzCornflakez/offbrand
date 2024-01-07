export interface OrderItemDto {
    order: { connect: { id: number } };
    product: { connect: { id: number } };
    quantity: number;
    color: string;
    price: number;
    is_deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;

}