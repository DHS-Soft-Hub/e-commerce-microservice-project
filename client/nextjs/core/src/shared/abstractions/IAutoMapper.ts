/**
 * Auto Mapper Interface
 * For automatic mapping configuration and execution
 */
export interface IAutoMapper {
  /**
   * Map object using configured mapping
   */
  map<TSource, TDestination>(source: TSource, destinationType: new () => TDestination): TDestination;

  /**
   * Map array using configured mapping
   */
  mapArray<TSource, TDestination>(source: TSource[], destinationType: new () => TDestination): TDestination[];

  /**
   * Create mapping configuration
   */
  createMap<TSource, TDestination>(
    sourceType: new () => TSource, 
    destinationType: new () => TDestination
  ): IMappingExpression<TSource, TDestination>;

  /**
   * Check if mapping exists
   */
  hasMapping<TSource, TDestination>(sourceType: new () => TSource, destinationType: new () => TDestination): boolean;

  /**
   * Get mapping configuration
   */
  getMapping<TSource, TDestination>(sourceType: new () => TSource, destinationType: new () => TDestination): IMappingExpression<TSource, TDestination>;

  /**
   * Validate all mappings
   */
  validateMappings(): void;
}

/**
 * Mapping Expression Interface
 * For configuring property mappings
 */
export interface IMappingExpression<TSource, TDestination> {
  /**
   * Map specific property
   */
  forMember<TProperty>(
    destinationProperty: keyof TDestination,
    configFunction: (source: TSource) => TProperty
  ): IMappingExpression<TSource, TDestination>;

  /**
   * Ignore a property
   */
  ignoreMember(destinationProperty: keyof TDestination): IMappingExpression<TSource, TDestination>;

  /**
   * Add condition for mapping
   */
  condition(predicate: (source: TSource) => boolean): IMappingExpression<TSource, TDestination>;

  /**
   * Add after mapping action
   */
  afterMap(action: (source: TSource, destination: TDestination) => void): IMappingExpression<TSource, TDestination>;

  /**
   * Add before mapping action
   */
  beforeMap(action: (source: TSource) => void): IMappingExpression<TSource, TDestination>;
}
