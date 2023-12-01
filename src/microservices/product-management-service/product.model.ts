export class Product {
    constructor(
        public product_id: number,
        public category_id: number,
        public name: string,
        public desc: string,
        public price: number,
        public discount: number,
        public picture: string,
        public average_score: string,
        public is_deleted: boolean,
        public created_at: string,
        public updated_at: string,

    ) {}

}

export class ProductInventory {
    constructor(
        public inventory_id: number,
        public product_id: number,
        public quantity: number,
        public color: string,
        public created_at: string,
        public updated_at: string,

    ) {}

}

export class Categories {
    constructor(
        public category_id: number,
        public name: string,
        public desc: string,
        public is_deleted: boolean,
        public created_at: string,
        public updated_at: string,

    ) {}

}