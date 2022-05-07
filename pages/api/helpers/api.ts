import WooCommerceAPI from "woocommerce-api";

const WooCommerce = new WooCommerceAPI({
    url: process.env.WOO_HOST,
    consumerKey: process.env.WOO_CONSUMER_KEY,
    consumerSecret: process.env.WOO_CONSUMER_SECRET,
    wpAPI: true,
    version: 'wc/v2'
});

export const getAllProducts = () => {
    const promises: Promise<any>[] = [];
    for (let i = 1; i <= 3; i++) {
        promises.push(WooCommerce.getAsync(`products?per_page=100&page=${i}`));
    }
    return promises;
}

