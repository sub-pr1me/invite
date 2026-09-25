
export default function fileToDataString(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject)=> {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onerror = (error) => reject(error);
    reader.onload = () => resolve(reader.result);
  })
};