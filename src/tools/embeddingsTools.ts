/**
 * Embeddings-related tool definitions
 *
 * This file defines all the MCP tool definitions related to embeddings and semantic search
 */
import {z} from 'zod'

import * as embeddingsController from '../controllers/embeddings.js'
import type {ListEmbeddingsIndicesParams, SemanticSearchParams} from '../types/sharedTypes.js'
import type {ToolProvider} from '../types/toolProvider.js'

/**
 * Provider for embeddings-related tool definitions
 */
export class EmbeddingsToolProvider implements ToolProvider {
  /**
   * Get all embeddings-related tool definitions
   *
   * @returns Array of embeddings tool definitions
   */
  getToolDefinitions(): ReturnType<ToolProvider['getToolDefinitions']> {
    return [
      {
        name: 'listEmbeddingsIndices',
        description: 'List all embeddings indices available for the project and dataset',
        parameters: z.object({
          projectId: z.string().describe('Project ID for the Sanity project'),
          dataset: z.string().describe('Dataset name within the project')
        }),
        handler: async (args: ListEmbeddingsIndicesParams) => {
          return await embeddingsController.listEmbeddingsIndices({
            projectId: args.projectId,
            dataset: args.dataset
          })
        }
      },
      {
        name: 'semanticSearch',
        description: 'Perform semantic search on Sanity documents using embeddings',
        parameters: z.object({
          query: z.string().describe('The search query to match documents against'),
          indexName: z.string().describe('The name of the embeddings index to search'),
          projectId: z.string().describe('Project ID for the Sanity project'),
          dataset: z.string().describe('Dataset name within the project'),
          maxResults: z.number().optional().default(10)
            .describe('Maximum number of results to return'),
          types: z.union([z.string(), z.array(z.string())]).optional().describe('Document type(s) to filter by')
        }),
        handler: async (args: SemanticSearchParams) => {
          // Convert string type to array if needed
          const types = typeof args.types === 'string' ? [args.types] : args.types

          return await embeddingsController.semanticSearch(args.query, {
            projectId: args.projectId,
            dataset: args.dataset,
            indexName: args.indexName,
            maxResults: args.maxResults,
            types
          })
        }
      }
    ]
  }
}
