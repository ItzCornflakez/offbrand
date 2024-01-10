"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const review_module_1 = require("./review/review.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(review_module_1.ReviewModule);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map