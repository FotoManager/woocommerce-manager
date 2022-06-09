import process from 'process';
import { ROUTES } from '../../../utils/config';

export const getAllProducts = async () => {
    const promises: Promise<any>[] = [];
    // for (let i = 1; i <= 3; i++) {
    //     promises.push(WooCommerce.getAsync(`products?per_page=100&page=${i}`));
    // }
    // return promises;

    for (let i = 1; i <= 3; i++) {
        promises.push(
            (await fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST }/inventory/${i}`)).json()
        );
    }

    // promises[0].then(res => {
    //     return res.json();
    // }).then(res => {
    //     console.log("response:", res);
    // });

    return promises;
}

export const updateProduct = (product: any, id:any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/${id}`, {
        method: 'PUT',
        body: product
    });
}

export const createProduct = (product: any) => {

    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/`, {
        method: 'POST',
        body: product
    });
}

export const createVariation = (product: any, parentId: string) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/${parentId}/variation/`, {
        method: 'POST',
        body: product
    });
}

export const updateVariation = (parentId:any, product: any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/${parentId}/variation/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            //cors
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ product })
    });
}
