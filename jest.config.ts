import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const customJestConfig = {
  preset: "ts-jest",
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  rootDir: "src",
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/../jest.setup.ts"],
  testEnvironment: "jsdom",
};

export default createJestConfig(customJestConfig);
