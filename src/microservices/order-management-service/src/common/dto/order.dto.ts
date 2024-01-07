export interface OrderDto {
    user: { connect: { id: number } };
    total_price: number;
    is_deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}