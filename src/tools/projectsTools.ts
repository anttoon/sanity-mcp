/**
 * Projects-related tool definitions
 *
 * This file defines all the MCP tool definitions related to projects and organizations
 */
import {z} from 'zod'

import config from '../config/config.js'
import * as projectsController from '../controllers/projects.js'
import type {ListStudiosParams} from '../types/sharedTypes.js'
import type {ToolProvider} from '../types/toolProvider.js'
import type {ToolDefinition} from '../types/tools.js'
import {createErrorResponse} from '../utils/documentHelpers.js'

/**
 * Projects tools provider class
 */
export class ProjectsToolProvider implements ToolProvider {
  /**
   * Get all projects-related tool definitions
   *
   * @returns Array of tool definition objects
   */
  // eslint-disable-next-line class-methods-use-this
  getToolDefinitions(): ToolDefinition[] {
    return ProjectsToolProvider.getToolDefinitionsStatic()
  }

  /**
   * Static method to get all projects-related tool definitions
   * This allows the method to be called without an instance
   *
   * @returns Array of tool definition objects
   */
  static getToolDefinitionsStatic(): ToolDefinition[] {
    return [
      {
        name: 'listOrganizationsAndProjects',
        description: 'List all organizations and their projects that the user has access to',
        parameters: z.object({}),
        handler: async () => {
          try {
            const result = await projectsController.listOrganizationsAndProjects()
            return result
          } catch (error) {
            return createErrorResponse('Error listing organizations and projects', error)
          }
        }
      },
      {
        name: 'listStudios',
        description: 'List all studios for a specific project',
        parameters: z.object({
          projectId: z.string().describe('ID of the project to list studios for')
        }),
        handler: async (args) => {
          try {
            const result = await projectsController.listStudios(args.projectId)
            return result
          } catch (error) {
            return createErrorResponse('Error listing studios', error)
          }
        }
      }
    ]
  }
}
