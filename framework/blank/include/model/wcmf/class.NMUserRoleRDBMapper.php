<?php
/**
 * This file was generated by wCMFGenerator 3.0.0017 from newroles.uml on Thu May 26 15:54:56 CEST 2011.
 * Manual modifications should be placed inside the protected regions.
 */
require_once(WCMF_BASE."wcmf/lib/model/mapper/class.NodeUnifiedRDBMapper.php");
require_once(WCMF_BASE."application/include/model/wcmf/class.NMUserRole.php");

/**
 * @class NMUserRoleRDBMapper
 * NMUserRoleRDBMapper maps NMUserRole Nodes to the database.
 * NMUserRole description:
 *
 * @author
 * @version 1.0
 */
class NMUserRoleRDBMapper extends NodeUnifiedRDBMapper
{
  /**
   * @see RDBMapper::getType()
   */
  public function getType()
  {
    return 'NMUserRole';
  }
  /**
   * @see PersistenceMapper::getPkNames()
   */
  public function getPkNames()
  {
    return array('fk_user_id', 'fk_role_id');
  }
  /**
   * @see PersistenceMapper::getProperties()
   */
  public function getProperties()
  {
    return array(
      'manyToMany' => array('RoleRDB', 'UserRDB'),
      'is_searchable' => true,
// PROTECTED REGION ID(application/include/model/wcmf/class.NMUserRoleRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }
  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null)
  {
    return null;
  }
  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions()
  {
    return array(
      'RoleRDB' => new RDBManyToOneRelationDescription('NMUserRole', 'NMUserRole', 'RoleRDB', 'RoleRDB', '0', 'unbounded', '1', '1', 'none', 'composite', 'true', 'true', 'parent', 'id', 'fk_role_id'),

      'UserRDB' => new RDBManyToOneRelationDescription('NMUserRole', 'NMUserRole', 'UserRDB', 'UserRDB', '0', 'unbounded', '1', '1', 'none', 'composite', 'true', 'true', 'parent', 'id', 'fk_user_id'),

    );
  }
  /**
   * @see RDBMapper::getAttributeDescriptions()
   */
  protected function getAttributeDescriptions()
  {
    return array(
     /**
      * Value description:
      */
      'fk_user_id' => new RDBAttributeDescription('fk_user_id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'nm_user_role', 'fk_user_id'),
     /**
      * Value description:
      */
      'fk_role_id' => new RDBAttributeDescription('fk_role_id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'nm_user_role', 'fk_role_id'),
    );
  }
  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null)
  {
    return new NMUserRole($oid);
  }
  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName()
  {
    return 'nm_user_role';
  }
}
?>
