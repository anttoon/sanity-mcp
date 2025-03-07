import { readFile } from 'fs/promises';
import config from '../config/config.js';
import { SchemaType, SchemaField } from '../types/index.js';
import { SanityDocument } from '../types/sanity.js';
import logger from '../utils/logger.js';

interface SchemaTypeDetails extends SchemaType {
  fields?: SchemaField[];
  [key: string]: any;
}

/**
 * Gets the full schema for a Sanity project and dataset
 * 
 * @param projectId - Sanity project ID
 * @param dataset - Dataset name (default: 'production')
 * @returns The schema object
 */
export async function getSchema(projectId: string, dataset: string = 'production'): Promise<SchemaTypeDetails[]> {
  try {
    const schemaPath = config.getSchemaPath(projectId, dataset);
    
    try {
      const schemaData = await readFile(schemaPath, 'utf-8');
      return JSON.parse(schemaData);
    } catch (readError: any) {
      if (readError.code === 'ENOENT') {
        throw new Error(
          `Schema file not found for project ${projectId} and dataset ${dataset}. ` +
          `Please run 'npx sanity@latest schema extract' in your Sanity studio and ` +
          `save the output to ${schemaPath}`
        );
      }
      throw readError;
    }
  } catch (error: any) {
    logger.error(`Error getting schema for ${projectId}/${dataset}:`, error);
    throw new Error(`Failed to get schema: ${error.message}`);
  }
}

/**
 * Gets the schema definition for a specific type
 * 
 * @param projectId - Sanity project ID
 * @param dataset - Dataset name (default: 'production')
 * @param typeName - The type name
 * @param options - Additional options for retrieving the schema
 * @returns The schema definition for the type
 */
export async function getSchemaForType(
  projectId: string, 
  dataset: string = 'production', 
  typeName: string, 
  options: { 
    includeReferences?: boolean;
  } = {}
): Promise<SchemaTypeDetails> {
  try {
    // Get the full schema
    const schema = await getSchema(projectId, dataset);
    
    // Find the specific type
    const typeSchema = schema.find(type => type.name === typeName);
    
    if (!typeSchema) {
      throw new Error(`Type ${typeName} not found in schema`);
    }
    
    // If references are not needed, return just the type schema
    if (!options.includeReferences) {
      return typeSchema;
    }
    
    // Find referenced types
    const referencedTypes = findReferencedTypes(typeSchema, schema);
    
    // Add references to the type schema (for backwards compatibility)
    return {
      ...typeSchema,
      references: referencedTypes
    };
  } catch (error: any) {
    logger.error(`Error getting schema for type ${typeName}:`, error);
    throw new Error(`Failed to get schema for type ${typeName}: ${error.message}`);
  }
}

/**
 * Find types that are referenced by a given type
 * 
 * @param typeSchema - The type to check for references
 * @param allTypes - All available types in the schema
 * @returns Array of referenced types
 */
function findReferencedTypes(typeSchema: SchemaTypeDetails, allTypes: SchemaTypeDetails[]): SchemaTypeDetails[] {
  const referencedTypes: SchemaTypeDetails[] = [];
  const processedTypes = new Set<string>();
  
  // Helper function to recursively find references
  function findReferences(type: SchemaTypeDetails) {
    // Skip if already processed
    if (processedTypes.has(type.name)) {
      return;
    }
    
    // Mark as processed
    processedTypes.add(type.name);
    
    // Process fields 
    if (type.fields && Array.isArray(type.fields)) {
      for (const field of type.fields) {
        // Check for reference types
        if (field.type === 'reference' && field.to) {
          const refTypes = Array.isArray(field.to) ? field.to : [field.to];
          
          for (const refType of refTypes) {
            const referencedType = allTypes.find(t => t.name === refType.type);
            if (referencedType && !processedTypes.has(referencedType.name)) {
              referencedTypes.push(referencedType);
              findReferences(referencedType);
            }
          }
        }
        
        // Check for array types with references
        if (field.type === 'array' && field.of) {
          const arrayTypes = Array.isArray(field.of) ? field.of : [field.of];
          
          for (const arrayType of arrayTypes) {
            if (arrayType.type === 'reference' && arrayType.to) {
              const refTypes = Array.isArray(arrayType.to) ? arrayType.to : [arrayType.to];
              
              for (const refType of refTypes) {
                const referencedType = allTypes.find(t => t.name === refType.type);
                if (referencedType && !processedTypes.has(referencedType.name)) {
                  referencedTypes.push(referencedType);
                  findReferences(referencedType);
                }
              }
            } else {
              // Handle other array types that aren't references
              const embeddedType = allTypes.find(t => t.name === arrayType.type);
              if (embeddedType && !processedTypes.has(embeddedType.name)) {
                referencedTypes.push(embeddedType);
                findReferences(embeddedType);
              }
            }
          }
        }
      }
    }
  }
  
  // Start the recursion
  findReferences(typeSchema);
  
  return referencedTypes;
}

/**
 * Lists available schema types for a Sanity project and dataset
 * 
 * @param projectId - Sanity project ID
 * @param dataset - Dataset name (default: 'production')
 * @param options - Options for listing schema types
 * @returns Array of schema type names and their kinds
 */
export async function listSchemaTypes(
  projectId: string, 
  dataset: string = 'production', 
  { allTypes = false }: { allTypes?: boolean } = {}
): Promise<SchemaType[]> {
  try {
    // Get the full schema
    const schema = await getSchema(projectId, dataset);
    
    // Filter to document types only, unless allTypes is true
    const filteredSchema = allTypes 
      ? schema 
      : schema.filter(type => type.type === 'document');
    
    // Map to just the name and type
    return filteredSchema.map(type => ({
      name: type.name,
      type: type.type
    }));
  } catch (error: any) {
    logger.error(`Error listing schema types:`, error);
    throw new Error(`Failed to list schema types: ${error.message}`);
  }
}

/**
 * Gets the detailed schema for a specific type
 * 
 * @param projectId - Sanity project ID
 * @param dataset - Dataset name (default: 'production')
 * @param typeName - The name of the type to retrieve
 * @returns The schema definition for the type
 */
export async function getTypeSchema(
  projectId: string, 
  dataset: string = 'production', 
  typeName: string
): Promise<SchemaTypeDetails> {
  try {
    // Get the full schema
    const schema = await getSchema(projectId, dataset);
    
    // Find the specific type
    const typeSchema = schema.find(type => type.name === typeName);
    
    if (!typeSchema) {
      throw new Error(`Type '${typeName}' not found in schema`);
    }
    
    return typeSchema;
  } catch (error: any) {
    logger.error(`Error getting type schema:`, error);
    throw new Error(`Failed to get type schema: ${error.message}`);
  }
}
