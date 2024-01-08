export interface ProductDto {
    name:          string;
    desc:          string;
    price:         number;
    picture:       string;
    is_deleted?: boolean;
    created_at?: Date;
    updated_at?: Date;
}