import { EnvironmentTypes } from "../types/EnvironmentTypes";

export default interface BundlerEnvironment {
  mode: EnvironmentTypes;
  isProduction: boolean;
  isDevelopment: boolean;
  isHot: boolean;
  isAnalyzing: boolean;
  isInspecting: boolean;
}
