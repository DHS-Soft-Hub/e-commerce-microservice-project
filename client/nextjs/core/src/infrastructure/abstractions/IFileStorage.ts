import { IResult } from '../../shared/types/IResult';

/**
 * File Storage Interface
 * For file upload, download, and management operations
 */
export interface IFileStorage {
  /**
   * Upload a file
   */
  upload(file: Uint8Array | File, key: string, options?: { contentType?: string; metadata?: Record<string, string> }): Promise<IResult<string>>;

  /**
   * Download a file
   */
  download(key: string): Promise<IResult<Uint8Array>>;

  /**
   * Delete a file
   */
  delete(key: string): Promise<IResult<void>>;

  /**
   * Check if file exists
   */
  exists(key: string): Promise<IResult<boolean>>;

  /**
   * Get file metadata
   */
  getMetadata(key: string): Promise<IResult<{ size: number; contentType: string; lastModified: Date }>>;

  /**
   * Get signed URL for file access
   */
  getSignedUrl(key: string, expiresIn?: number): Promise<IResult<string>>;

  /**
   * List files in a directory/prefix
   */
  listFiles(prefix?: string, limit?: number): Promise<IResult<Array<{ key: string; size: number; lastModified: Date }>>>;

  /**
   * Copy a file
   */
  copy(sourceKey: string, destinationKey: string): Promise<IResult<void>>;

  /**
   * Move a file
   */
  move(sourceKey: string, destinationKey: string): Promise<IResult<void>>;
}
