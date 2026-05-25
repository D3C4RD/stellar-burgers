import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
    transform: {
      // '^.+\\.[tj]sx?$' для обработки файлов js/ts с помощью `ts-jest`
      // '^.+\\.m?[tj]sx?$' для обработки файлов js/ts/mjs/mts с помощью `ts-jest`
      '^.+\\.tsx?$': 'ts-jest',
    },

    //*************************************
    // настройки для ts-jest

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",              
    
    // A preset that is used as a base for Jest's configuration
    preset: 'ts-jest',

    
    // The test environment that will be used for testing
      testEnvironment: 'jsdom',

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api.ts'
    // '^@api(.*)$': '<rootDir>/src/utils/burger-api.ts'
    },
    testPathIgnorePatterns: ['/node_modules/', '/tests/'],
    transformIgnorePatterns: ['/node_modules/', '/tests/'],
    //**************************************
};

export default config; 
