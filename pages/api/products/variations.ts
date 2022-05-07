import { NextApiRequest, NextApiResponse } from 'next'
import { WooCommerce } from './__config';


const handle = (req: NextApiRequest, res: NextApiResponse) => {
    const { parentId } = req.body;

    WooCommerce.get(`products/${parentId}/variations`, (err, data) => {
        if (err) {
            res.status(500).json({
                message: err.message
            })
        } else {
            res.status(200).send(data.body)
        }
    })
    
}

export default handle;