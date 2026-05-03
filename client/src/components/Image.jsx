import getImageUrl from '../functions/getImageUrl';

export default function Image({ src, alt}) {

  const cloudName = src?.split('/')[3];
  const publicId = src?.split('/')[7].split('.')[0];
  
  const imageSource = getImageUrl({
    cloudName,
    publicId,
    transformations: 'q_auto:low,f_auto,c_fill,w_auto'
  });

  return <img src={imageSource} alt={alt} />
};