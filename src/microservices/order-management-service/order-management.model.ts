export class Orders {
    constructor(
        public order_id: number,
        public user_id: number,
        public total_price: number,
        public created_at: string,
        public updated_at: string,

    ) {}

}

export class OrderItems {
    constructor(
        public order_item: number,
        public product_id: number,
        public order_id: number,
        public quantity: number,
        public color: string,
        public price: number,
        public created_at: string,
        public updated_at: string,

    ) {}

}