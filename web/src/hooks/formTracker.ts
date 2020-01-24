import { ChangeEvent, useState } from "react";

export const useFormTracker = (initialValues: Record<string, any>) => {
  const [values, setValues] = useState(initialValues);

  return {
    values,

    handleChange(event: ChangeEvent<HTMLInputElement>) {
      const name = event.target.name;
      const value = event.target.value;

      setValues(st => {
        return { ...st, [name]: value };
      });
    }
  };
};
