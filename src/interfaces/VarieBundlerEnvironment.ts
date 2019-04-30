import { EnvironmentTypes } from "../types/EnvironmentTypes";

export default interface VarieBundlerEnvironment {
  mode: EnvironmentTypes;
  isProduction: boolean;
  isDevelopment: boolean;
  isHot: boolean;
  isModern: boolean;
  isAnalyzing: boolean;
}
