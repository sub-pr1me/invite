import getImageUrl from "../functions/getImageUrl";

export default function Thumb({ cloudName, publicId, alt }) {
  const imageSource = getImageUrl({
    cloudName,
    publicId,
    transformations: "q_auto,f_auto,c_thumb,w_auto,ar_1"
  });

  // add the full URL to a standard HTML5 video element
  return <img src={imageSource} alt={alt} />;
};