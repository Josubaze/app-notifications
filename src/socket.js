import Product from './models/product.schema'

export default (io) => {
    io.on('connection', (socket) => {
        const emitProduct = async () => {
            const products = await Product.find();
            io.emit('loadProducts', products);
        }
        emitProduct();
    });
}