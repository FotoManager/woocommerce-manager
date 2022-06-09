import { NextApiRequest, NextApiResponse } from "next";
import { WooCommerce } from "../__config";
import { IncomingForm } from "formidable";
import fs from "fs";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { method } = req;

  if (method === "GET") {
    WooCommerce.get(`products/${id}`, (err, data) => {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send(data.body);
    });
  } else if (method === "PUT") {
    const data: any = await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(err);
        }
        resolve({ fields, files });
      });
    });

    const { fields, files } = data;

    const product = fields;
    const images = files["images"];

    product.categories = JSON.parse(product.categories);
    product.attributes = JSON.parse(product.attributes);

    const headers = {};

    if (!images) {
      WooCommerce.put(`products/${id}`, product, (err, data) => {
        if (err) {
          res.status(503).send(err);
        } else {
          res.status(201).send(data);
        }
      });
    } else {
      headers["Content-Type"] = "multipart/form-data";
      headers["Accept"] = "application/json";
      headers["Content-Disposition"] =
        "attachment; filename=" + images.originalFilename;
      axios.defaults.headers.common["Authorization"] =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsIm5hbWUiOiJKcHJpZXRvIiwiaWF0IjoxNjU0NTcxNjMwLCJleHAiOjE4MTIyNTE2MzB9.UUX7XDNpaugrkYBnQaAXtL-f3JGbfdNNqESNUKeifqQ";
      axios.defaults.headers.post["Content-Type"] = "multipart/form-data";

      //Read file
      const file = fs.readFileSync(images.filepath);

      axios
        .post("https://tornicentro.com.co/wp-json/wp/v2/media/", file, {
          headers,
        })
        .then((response) => {
          product["images"] = [{ id: response.data.id }];
          WooCommerce.put(`products/${id}`, product, (err, data) => {
            if (err) {
              res.status(503).send(err);
            } else {
              res.status(201).send(data);
            }
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(200).send(error);
        });
    }
  }
};

export default handle;
