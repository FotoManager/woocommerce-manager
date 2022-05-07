import WooCommerceAPI from "woocommerce-api";

export const WooCommerce = new WooCommerceAPI({
    url: process.env.WOO_HOST,
    consumerKey: process.env.WOO_CONSUMER_KEY,
    consumerSecret: process.env.WOO_CONSUMER_SECRET,
    wpAPI: true,
    version: 'wc/v2'
});