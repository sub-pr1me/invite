import getImageUrl from "../functions/getImageUrl";

export default function Image({ cloudName, publicId, alt }) {
  const imageSource = getImageUrl({
    cloudName,
    publicId,
    transformations: "q_auto,f_auto,c_fill,g_face,w_400,ar_1"
  });

  return <img src={imageSource} alt={alt} />;
}
