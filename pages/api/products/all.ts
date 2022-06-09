import { NextApiRequest, NextApiResponse } from 'next'
import { WooCommerce } from './__config';
import { ROUTES } from "../../../utils/config";
import axios from "axios";

const handle = (req: NextApiRequest, res: NextApiResponse) => {
    //Response promises
    const promises: Promise<any>[] = [];
    for (let i = 1; i <= 3; i++) {
        promises.push(WooCommerce.getAsync(`products?per_page=100&page=${i}`));
    }
    
    Promise.all(promises).then(values => {
        const products = values.map(value => JSON.parse(value.body));
        res.status(200).send(products);
    }).catch(err => {
        res.status(500).json(err);
    });
}

export default handle;