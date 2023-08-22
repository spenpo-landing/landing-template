"use client";
import { useMemo } from "react";

export interface EnvVariable {
  key: string;
  target: string[];
  type: string;
  value: string;
}

export const useLandEnvVars = (
  variables: Record<string, string | undefined>
): EnvVariable[] => {
  const environmentVariables = useMemo(() => {
    return Object.entries(variables)
      .filter(([, value]) => !!value)
      .map(([key, value]) => {
        return {
          key,
          target: ["production"],
          type: "encrypted",
          value: value!,
        };
      });
  }, [variables]);

  return environmentVariables;
};
