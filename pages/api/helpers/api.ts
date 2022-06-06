import { ROUTES } from "../../../utils/config";

export const getAllProducts = async () => {
    const promises: Promise<any>[] = [];
    // for (let i = 1; i <= 3; i++) {
    //     promises.push(WooCommerce.getAsync(`products?per_page=100&page=${i}`));
    // }
    // return promises;

    for (let i = 1; i <= 3; i++) {
        promises.push(
            (await fetch(`${process.env.API_HOST}/products/${i}`)).json()
        );
    }

    // promises[0].then(res => {
    //     return res.json();
    // }).then(res => {
    //     console.log("response:", res);
    // });

    return promises;
}

export const updateProduct = (product: any) => {
    fetch(`${process.env.API_HOST}/products/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            //cors
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ product })
    });
}

export const updateVariation = (parentId:any, product: any) => {
    fetch(`${process.env.API_HOST}/products/${parentId}/variation/${product.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            //cors
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ product })
    });
}