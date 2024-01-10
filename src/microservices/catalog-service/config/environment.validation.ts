/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { IsBoolean, IsNumber, IsString, validateSync } from 'class-validator';

//Defines what should be included in the .env.test file
class TestEnvironmentVariables {
    @IsNumber()
    CATALOG_DATABASE_PORT: number

    @IsNumber()
    CATALOG_APP_PORT: number

    @IsString()
    CATALOG_DATABASE_CONTAINER_NAME: string;

    @IsString()
    CATALOG_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    CATALOG_DATABASE_NAME: string;

    @IsString()
    CATALOG_DATABASE_USER: string;

    @IsString()
    CATALOG_DATABASE_PASSWORD: string;

    @IsString()
    CATALOG_DATABASE_URL: string;
    
    @IsBoolean()
    CATALOG_RABBITMQ_ENABLED: boolean

    @IsString()
    CATALOG_NODE_ENV: string;
}

//Defines what should be included in the .env.production file
class ProductionEnvironmentVariables{
    @IsNumber()
    CATALOG_DATABASE_PORT: number

    @IsNumber()
    CATALOG_APP_PORT: number

    @IsString()
    CATALOG_DATABASE_CONTAINER_NAME: string;

    @IsString()
    CATALOG_APP_CONTAINER_NAME: string;

    @IsNumber()
    CATALOG_DATABASE_CONN_RETRY_DELAY: number

    @IsString()
    CATALOG_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    CATALOG_DATABASE_NAME: string;

    @IsString()
    CATALOG_DATABASE_USER: string;

    @IsString()
    CATALOG_DATABASE_PASSWORD: string;

    @IsString()
    CATALOG_DATABASE_URL: string;

    @IsBoolean()
    CATALOG_RABBITMQ_ENABLED: boolean

    @IsString()
    CATALOG_NODE_ENV: string;

}

export function validateTestEnvFile(config: Record<string,unknown>){
    const validatedTestConfig = plainToInstance(
            TestEnvironmentVariables, 
            config, 
            {enableImplicitConversion: true},
    );

    const errors = validateSync(validatedTestConfig, {skipMissingProperties: false});

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

    return validatedTestConfig;

}

export function validateProductionEnvFile(config: Record<string,unknown>){
    const validatedProductionConfig = plainToInstance(
        ProductionEnvironmentVariables, 
        config, 
        {enableImplicitConversion: true},
    );

    const errors = validateSync(validatedProductionConfig, {skipMissingProperties: false});

    if(errors.length > 0){
        throw new Error(errors.toString());
    }

    return validatedProductionConfig;

}