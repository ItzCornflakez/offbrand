"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const httpException_filter_1 = require("./common/exception-filters/httpException.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
    }));
    app.useGlobalFilters(new httpException_filter_1.HttpExceptionFilter(new common_1.Logger()));
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('PMS_APP_PORT');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
    });
    const options = new swagger_1.DocumentBuilder()
        .addBearerAuth()
        .setTitle('Offbrand - Product-Management-Service API')
        .setDescription('Endpoints for the offbrand product management service')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup(`/docs`, app, document);
    console.log('APP listening on PORT ', port);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map