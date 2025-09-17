import { tool } from '@langchain/core/tools';
import z from 'zod';
import { ctApiRoot } from '../../services/commercetools/apiRoot';
import { Cart } from '@commercetools/platform-sdk';

const createGetCartTool = ({ WaId }: { WaId: string }) =>
  tool(
    async () => {
      console.log('tool getCart', WaId);
      let activeCart: Cart;

      const activeCartResponse = await ctApiRoot
        .carts()
        .get({
          queryArgs: { where: `anonymousId="${WaId}"`, limit: 1 },
        })
        .execute();

      if (activeCartResponse.body.results.length === 0) {
        const createCartResponse = await ctApiRoot
          .carts()
          .post({
            body: {
              currency: 'USD',
              anonymousId: WaId,
            },
          })
          .execute();
        activeCart = createCartResponse.body;
      } else {
        activeCart = activeCartResponse.body.results[0];
      }

      const { lineItems, totalPrice, id } = activeCart;
      return {
        cartId: id,
        lineItems: lineItems.map((item) => ({
          name: item.name,
          id: item.id,
          quantity: item.quantity,
          price: item.price.value.centAmount,
          currency: item.price.value.currencyCode,
          fractionDigits: item.price.value.fractionDigits,
        })),
        totalPrice,
      };
    },
    {
      name: 'get_cart',
      description: `Devuelve el carrito actual.
        Devuelve un objeto en formato JSON con formato {cartId:"",lineItems:[{name:"",id:"",quantity:0,price:0,currency:"",fractionDigits:0}],totalPrice:{centAmount:0,currencyCode:"",fractionDigits:0}}`,
      schema: z.object({
        noOp: z.string().optional().describe('No-op parameter.'),
      }),
    },
  );

export { createGetCartTool };
