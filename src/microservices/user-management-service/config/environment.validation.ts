/* eslint-disable prettier/prettier */
import { plainToInstance } from 'class-transformer';
import { IsNumber, IsString, validateSync } from 'class-validator';

//Defines what should be included in the .env.test file
class TestEnvironmentVariables {
    @IsNumber()
    UMS_DATABASE_PORT: number

    @IsNumber()
    UMS_APP_PORT: number

    @IsString()
    UMS_DATABASE_CONTAINER_NAME: string;

    @IsString()
    UMS_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    UMS_DATABASE_NAME: string;

    @IsString()
    UMS_DATABASE_USER: string;

    @IsString()
    UMS_DATABASE_PASSWORD: string;

    @IsString()
    UMS_DATABASE_URL: string;

    @IsString()
    UMS_NODE_ENV: string;
}

//Defines what should be included in the .env.production file
class ProductionEnvironmentVariables{
    @IsNumber()
    UMS_DATABASE_PORT: number

    @IsNumber()
    UMS_APP_PORT: number

    @IsString()
    UMS_DATABASE_CONTAINER_NAME: string;

    @IsString()
    UMS_APP_CONTAINER_NAME: string;

    @IsNumber()
    UMS_DATABASE_CONN_RETRY_DELAY: number

    @IsString()
    UMS_DATABASE_ROOT_PASSWORD: string;

    @IsString()
    UMS_DATABASE_NAME: string;

    @IsString()
    UMS_DATABASE_USER: string;

    @IsString()
    UMS_DATABASE_PASSWORD: string;

    @IsString()
    UMS_DATABASE_URL: string;

    @IsString()
    UMS_NODE_ENV: string;

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