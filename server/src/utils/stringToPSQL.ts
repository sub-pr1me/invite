export default function toPostgresArray(arr: unknown): string {
  if (!Array.isArray(arr)) { return `"${arr}"`}; // If it's a string element, wrap it in double quotes      
  
  const contents = arr.map(toPostgresArray).join(','); // Recursively process elements and join them with commas inside curly braces
  return `{${contents}}`;
};