export const blankValidator = (
  validate: Record<string, any>,
  callbackfn: (...args: any) => any,
  fnArgs: any[] = []
) => {
  let unit = true;

  Object.values(validate).forEach(value => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      unit = false;
    }
  });

  if (unit) {
    return callbackfn(...fnArgs);
  }
};
