/**
 * Mapper Interface
 * For mapping between different object types
 */
export interface IMapper<TSource, TDestination> {
  /**
   * Map single source object to destination
   */
  map(source: TSource): TDestination;

  /**
   * Map array of source objects to destination array
   */
  mapArray(source: TSource[]): TDestination[];

  /**
   * Map with additional context
   */
  mapWithContext?(source: TSource, context: Record<string, any>): TDestination;

  /**
   * Reverse map from destination to source
   */
  reverseMap?(destination: TDestination): TSource;
}

/**
 * Bi-directional Mapper Interface
 * For mapping in both directions
 */
export interface IBiDirectionalMapper<TFirst, TSecond> {
  /**
   * Map from first type to second
   */
  mapToSecond(source: TFirst): TSecond;

  /**
   * Map from second type to first
   */
  mapToFirst(source: TSecond): TFirst;

  /**
   * Map array from first to second
   */
  mapArrayToSecond(source: TFirst[]): TSecond[];

  /**
   * Map array from second to first
   */
  mapArrayToFirst(source: TSecond[]): TFirst[];
}
