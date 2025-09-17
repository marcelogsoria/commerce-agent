import { tool } from '@langchain/core/tools';
import z from 'zod';
import { ctApiRoot } from '../../services/commercetools/apiRoot';

const getCategoriesTool = tool(
  async ({ parentId }: { parentId?: string }) => {
    console.log('tool getCategories', parentId);
    const whereFilter = parentId
      ? `parent(id="${parentId}")`
      : 'parent is not defined';
    const categoriesResponse = await ctApiRoot
      .categories()
      .get({ queryArgs: { where: whereFilter, limit: 500 } })
      .execute();

    const categories = categoriesResponse.body.results.map(
      (category) => `{"name": ${category.name['en-GB']},"id":${category.id}`,
    );

    return JSON.stringify(categories, null, 2);
  },
  {
    name: 'get_categories',
    description:
      'Devuelve las caregorías de productos disponibles en Ingés. Devuelve un array de objetos en formato JSON con formato {name:"",id:""}',
    schema: z.object({
      parentId: z
        .string()
        .optional()
        .describe(
          'id de la categoría padre o vacío para obtener las categorías de nivel superior',
        ),
    }),
  },
);

export { getCategoriesTool };
