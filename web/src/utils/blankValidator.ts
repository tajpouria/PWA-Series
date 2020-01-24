export const blankValidator = (
  validate: Record<string, string>,
  callbackfn: (...args: any) => any,
  fnArgs: any[] = []
) => {
  let unit = true;

  Object.values(validate).forEach(value => {
    if (value.trim() === "") {
      unit = false;
    }
  });

  if (unit) {
    return callbackfn(...fnArgs);
  }
};
