import { tool } from '@langchain/core/tools';
import z from 'zod';

const getProductsFromCategoryTool = tool(
  async ({ categoryId }: { categoryId: string }) => {
    console.log('tool getProductsFromCategory', categoryId);
    const whereFilter = `categories.id:"${categoryId}"`;

    const productsFromCategory = await ctApiRoot
      .productProjections()
      .search()
      .get({
        queryArgs: {
          where: whereFilter,
          limit: 500,
          expand: 'variants',
        },
      })
      .execute();

    if (productsFromCategory.body.results.length === 0) {
      return 'No hay productos en esta categoría';
    }
    const products = productsFromCategory.body.results.map((product) => {
      const { name, id, variants, masterVariant } = product;

      return {
        name,
        id,
        variants: [
          ...variants.map((variant) => ({
            id: variant.id,
            sku: variant.sku,
            price: variant.price?.value.centAmount ?? 0,
            currency: variant.price?.value.currencyCode ?? 'USD',
            fractionDigits: variant.price?.value.fractionDigits ?? 2,
          })),
          masterVariant,
        ],
      };
    });

    return JSON.stringify(products, null, 2);
  },
  {
    name: 'get_products_from_category',
    description: `Devuelve los productos de una categoría.
        Devuelve un array de objetos en formato JSON con formato {name:"",id:"",variants:[{id:"",sku:"",price:0,currency:"",fractionDigits:0}]}`,
    schema: z.object({
      categoryId: z
        .string()

        .describe(
          'id de la categoría para obtener los productos de esa categoría',
        ),
    }),
  },
);

export { getProductsFromCategoryTool };
