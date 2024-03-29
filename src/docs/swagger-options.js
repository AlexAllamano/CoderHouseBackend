import path from 'path';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'CoderHouse Backend API - Allamano Alexis',
            version: '1.0.0',
            description: 'Backend API for the project',
        },
    },
    apis: [path.resolve('./src/docs/**/*.yaml')],
};


const spec = swaggerJSDoc(swaggerOptions);
export default spec;