import { NextApiRequest, NextApiResponse } from 'next'
import { WooCommerce } from './__config';


const handle = (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    WooCommerce.get(`products/${id}`, (err, data) => {
        if(err){
            res.status(500).send(err);
        }
        res.status(200).send(data.body);
    })
}

export default handle;