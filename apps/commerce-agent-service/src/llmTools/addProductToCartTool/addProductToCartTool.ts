import { tool } from '@langchain/core/tools';
import z from 'zod';
import { ctApiRoot } from '../../services/commercetools/apiRoot';

const addProductToCartTool = tool(
  async ({
    cartId,
    sku,
    quantity,
  }: {
    cartId: string;
    sku: string;
    quantity: number;
  }) => {
    console.log('tool addProductToCart', cartId, sku, quantity);

    // Primero buscamos el producto por SKU
    const productResponse = await ctApiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          where: `variants(sku="${sku}") or masterVariant(sku="${sku}")`,
          limit: 1,
        },
      })
      .execute();

    if (productResponse.body.results.length === 0) {
      return 'No se encontró el producto con el SKU especificado';
    }

    const product = productResponse.body.results[0];
    const variant =
      product.variants.find((v) => v.sku === sku) ||
      (product.masterVariant.sku === sku ? product.masterVariant : null);

    if (!variant) {
      return 'No se encontró la variante del producto con el SKU especificado';
    }

    try {
      // Obtenemos el carrito actual para obtener su versión
      const currentCartResponse = await ctApiRoot
        .carts()
        .withId({ ID: cartId })
        .get()
        .execute();

      // Agregamos el producto al carrito
      const cartResponse = await ctApiRoot
        .carts()
        .withId({ ID: cartId })
        .post({
          body: {
            version: currentCartResponse.body.version,
            actions: [
              {
                action: 'addLineItem',
                productId: product.id,
                variantId: variant.id,
                quantity: quantity,
              },
            ],
          },
        })
        .execute();

      const { lineItems, totalPrice } = cartResponse.body;
      return JSON.stringify({
        cartId: cartId,
        lineItems: lineItems.map((item) => ({
          name: item.name,
          id: item.id,
          quantity: item.quantity,
          price: item.price.value.centAmount,
          currency: item.price.value.currencyCode,
          fractionDigits: item.price.value.fractionDigits,
        })),
        totalPrice,
      });
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      return 'Error al agregar el producto al carrito. Por favor, intente nuevamente.';
    }
  },
  {
    name: 'add_product_to_cart',
    description: `Agrega un producto por sku y cantidad al carrito, devuelve el carrito actualizado.
        Devuelve un objeto en formato JSON con formato {cartId:"",lineItems:[{name:"",id:"",quantity:0,price:0,currency:"",fractionDigits:0}],totalPrice:{centAmount:0,currencyCode:"",fractionDigits:0}}`,
    schema: z.object({
      cartId: z.string().describe('id del carrito para agregar el producto'),
      sku: z.string().describe('sku del producto para agregar al carrito'),
      quantity: z
        .number()
        .describe('cantidad del producto para agregar al carrito'),
    }),
  },
);

export { addProductToCartTool };
