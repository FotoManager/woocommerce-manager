import process from 'process';
import { ROUTES } from '../../../utils/config';

export const getAllProducts = async () => {
    const promises: Promise<any>[] = [];
    for (let i = 1; i <= 3; i++) {
        promises.push(
            (await fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST }/inventory/${i}`)).json()
        );
    }
    return promises;
}

export const getProducts = async ( page = 1, search = "") => {
    return await fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST }/inventory?page=${page}&search=${search}`);
}

export const updateProduct = (product: any, id:any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/${id}`, {
        method: 'PUT',
        mode: 'no-cors',
        body: product
    });
}

export const createProduct = (product: any) => {

    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/products/`, {
        method: 'POST',
        mode: 'no-cors',
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
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            //cors
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ product })
    });
}

export const deleteProduct = (id:any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/product/${id}`, {
        method: 'DELETE'
    });
}


export const getTags = async ( page = 1, search = "") => {
    return await fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST }/tags?page=${page}&search=${search}`);
}

export const deleteTag = (id:any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/tag/${id}`, {
        method: 'DELETE'
    });
}

export const createTag = (tag:any) => {
    return fetch(`${process.env.API_HOST ? process.env.API_HOST : ROUTES.API_HOST}/tag/`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
            //cors
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ tag })
    });
}