export const validateBudget = (min, max) => {
  if (min === "" || max === "") {
    return "Please enter valid input";
  }

  if (isNaN(min) || isNaN(max)) {
    return "Please enter valid input";
  }

  if (Number(min) > Number(max)) {
    return "Minimum budget cannot be greater than maximum";
  }

  return "";
};
