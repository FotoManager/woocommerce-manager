import nextConnect from 'next-connect';
import multer from 'multer';
import cloudinary from 'cloudinary';
import { IncomingForm } from 'formidable';

cloudinary.v2.config({
  cloud_name: process.env.IMG_CLOUD_NAME,
  api_key: process.env.IMG_API_KEY,
  api_secret: process.env.IMG_API_SECRET
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handle (req:any, res:any) {
  const data:any = await new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err:any, fields:any, files:any) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
  console.log(data)
  const { files } = data;

  const uploads = Object.keys(files).map(async (key:any) => {
    const file = files[key];
    const { filepath } = file;
    const { originalFilename } = file;
    const name = originalFilename.split('.')[0];

    const { url } = await cloudinary.v2.uploader.upload(filepath, {
      resource_type: 'image',
      public_id: req.query.id+"-"+name,
    });

    return { [key]:url };
  });

  const result = await Promise.all(uploads);
  const dataResult = result.reduce((acc:any, cur:any) => {
    return { ...acc, ...cur };
  }, {});

  res.json(dataResult);
};