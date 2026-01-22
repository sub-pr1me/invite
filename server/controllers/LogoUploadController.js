
export default async function handleLogoUpload(req, res) {

  console.log(JSON.stringify(req.file));
  res.status(200).json('FILE UPLOADED');

};