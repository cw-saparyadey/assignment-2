const handleRemove = (valueToRemove, setter, key) => {
  setter((prev) =>
    key
      ? prev.filter((item) => item[key] !== valueToRemove)
      : prev.filter((item) => item !== valueToRemove)
  );
};
export default handleRemove;