export const formatMuscleName = (identifier: string) =>
  identifier
    .split('_')
    .map((segment) =>
      segment.length === 0 ? segment : segment[0].toUpperCase() + segment.slice(1).toLowerCase()
    )
    .join(' ');

export const formatList = (values: string[]) => {
  if (values.length === 0) {
    return '';
  }

  if (values.length === 1) {
    return values[0];
  }

  const tail = values.slice(0, -1).join(', ');
  const last = values[values.length - 1];
  return `${tail}, and ${last}`;
};
