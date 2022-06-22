function toQueryParams(obj: Object) {
  const queryParams = Object.entries(obj).reduce(
    (acc, { "0": key, "1": value }, index) =>
      `${acc}${index === 0 ? "" : "&"}${key}=${value}`,
    "?"
  );

  return queryParams;
}

export { toQueryParams };
