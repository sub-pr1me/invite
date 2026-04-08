export default function getImageUrl({ cloudName, publicId, transformations }) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}.jpg`;
};
