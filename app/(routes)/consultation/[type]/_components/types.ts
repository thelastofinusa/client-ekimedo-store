import { IconRegistry } from "hugeicons-proxy";

export type CheckboxInterest = {
  id: string;
  label: string;
  description?: string;
};

export type CheckboxOption = {
  id: string;
  label: string;
  description?: string;
  interests?: CheckboxInterest[];
};

export type CheckboxFieldConfig = {
  name: string;
  type: "checkbox";
  label: string;
  required?: boolean;
  errMsg?: string;
  defaultValue?: unknown;
  options: CheckboxOption[];
};

export type FieldConfig =
  | {
      name: string;
      type: "text" | "email" | "tel" | "textarea";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      errMsg?: string;
      icons?: {
        start: { icon: keyof IconRegistry };
        end: { value: string };
      };
    }
  | {
      name: string;
      type: "number";
      required?: boolean;
      defaultValue?: number;
      placeholder?: string;
      min?: number;
      max?: number;
      errMsg?: string;
      icons?: {
        start: { icon: keyof IconRegistry };
        end: { value: string };
      };
    }
  | {
      name: string;
      type: "date" | "datetime-local";
      required?: boolean;
      defaultValue?: Date;
      errMsg?: string;
    }
  | {
      name: string;
      type: "select";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      options: { label: string; value: string }[];
      errMsg?: string;
    }
  | {
      name: string;
      type: "file";
      required?: boolean;
      defaultValue?: string;
      placeholder?: string;
      min?: number;
      max?: number;
      size: number;
      errMsg?: string;
    }
  | {
      name: string;
      type: "size";
      label: string;
      required?: boolean;
      errMsg?: string;
      defaultValue?: unknown;
      sizes: {
        name: string;
        value: string;
      }[];
    }
  | {
      name: string;
      type: "radio";
      label: string;
      required?: boolean;
      errMsg?: string;
      defaultValue?: string;
      items: {
        id: string;
        title: string;
        description: string;
        range: {
          from: number;
          to?: number;
        };
        images?: string[];
      }[];
    }
  | CheckboxFieldConfig;
