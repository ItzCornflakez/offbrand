export class Review {
    constructor(
        public review_id: number,
        public user_id: number,
        public product_id: number,
        public name: string,
        public score: number,
        public comment: string,
        public dislikes: number,
        public likes: number,
        public created_at: string,
        public updated_at: string,

    ) {}

}