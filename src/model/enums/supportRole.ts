// SupportRole enum type
/**
 * Defines the different roles available in the support system.
 */
export enum SupportRole {
  /**
   * Super Admin: Has the highest level of access and can manage all aspects of the system.
   */
  SUPER_ADMIN = 0,
  /**
   * Admin: Manages users and system operations but has fewer privileges than Super Manager.
   */
  ADMIN = 1,
  /**
   * Manager: Has high-level management permissions, but with some restrictions compared to Super Admin.
   */
  MANAGER = 2,
  /**
   * Support: Handles customer support and basic system operations with limited access.
   */
  SUPPORT = 3,
}