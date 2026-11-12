import { useId } from "react";

/** React ids contain characters that break `url(#...)` references; strip them. */
export const useSafeId = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
