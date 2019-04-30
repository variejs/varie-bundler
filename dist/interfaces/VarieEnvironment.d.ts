import { EnvironmentTypes } from "../types/EnvironmentTypes";
export default interface VarieEnvironment {
  mode: EnvironmentTypes;
  isProduction: Boolean;
  isDevelopment: Boolean;
  isHot: Boolean;
  isModern: Boolean;
  isAnalyzing: Boolean;
}
