/**
 * Projects-related tool definitions
 * 
 * This file defines all the MCP tool definitions related to projects and organizations
 */
import { z } from 'zod';
import { ToolDefinition } from '../types/tools.js';
import { ToolProvider } from '../types/toolProvider.js';
import * as projectsController from '../controllers/projects.js';

/**
 * Projects tools provider class
 */
export class ProjectsToolProvider implements ToolProvider {
  /**
   * Get all projects-related tool definitions
   * 
   * @returns Array of tool definition objects
   */
  getToolDefinitions(): ToolDefinition[] {
    return [
      {
        name: 'listOrganizationsAndProjects',
        description: 'List all organizations and their projects that the user has access to',
        parameters: z.object({}),
        handler: async (_args: any) => {
          return await projectsController.listOrganizationsAndProjects();
        }
      },
      {
        name: 'listStudios',
        description: 'List all studios for a specific project',
        parameters: z.object({
          projectId: z.string().describe('ID of the project to list studios for')
        }),
        handler: async (args: any) => {
          return await projectsController.listStudios(args.projectId);
        }
      }
    ];
  }
}
