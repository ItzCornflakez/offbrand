import { Status } from "@prisma/client";

export interface OrderDto {
    user: { connect: { id: number } };
    total_price: number;
    status? : Status;
    created_at?: Date;
    updated_at?: Date;
}