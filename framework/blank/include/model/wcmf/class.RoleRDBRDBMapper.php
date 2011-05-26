<?php
/**
 * This file was generated by wCMFGenerator 3.0.0017 from newroles.uml on Thu May 26 15:54:56 CEST 2011. 
 * Manual modifications should be placed inside the protected regions.
 */
require_once(WCMF_BASE."wcmf/lib/model/mapper/class.NodeUnifiedRDBMapper.php");
require_once(WCMF_BASE."application/include/model/wcmf/class.RoleRDB.php");

/**
 * @class RoleRDBRDBMapper
 * RoleRDBRDBMapper maps RoleRDB Nodes to the database.
 * RoleRDB description: 
 *
 * @author 
 * @version 1.0
 */
class RoleRDBRDBMapper extends NodeUnifiedRDBMapper
{
  /**
   * @see RDBMapper::getType()
   */
  public function getType()
  {
    return 'RoleRDB';
  }
  /**
   * @see PersistenceMapper::getPkNames()
   */
  public function getPkNames()
  {
    return array('id');
  }
  /**
   * @see PersistenceMapper::getProperties()
   */
  public function getProperties()
  {
    return array(
      'is_searchable' => true,
      'display_value' => 'name',
// PROTECTED REGION ID(application/include/model/wcmf/class.RoleRDBRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }
  /**
   * @see PersistenceMapper::isSortable()
   */
  public function isSortable()
  {
    return false;
  }
  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null)
  {
    return array('sortFieldName' => 'name', 'sortDirection' => 'ASC');
  }
  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions()
  {
    return array(
      'UserRDB' => new RDBManyToManyRelationDescription(
        /* this -> nm  */ new RDBOneToManyRelationDescription('RoleRDB', 'RoleRDB', 'NMUserRole', 'NMUserRole', '1', '1', '0', 'unbounded', 'composite', 'none', 'true', 'true', 'child', 'id', 'fk_role_id'),
        /* nm -> other */ new RDBManyToOneRelationDescription('NMUserRole', 'NMUserRole', 'UserRDB', 'UserRDB', '0', 'unbounded', '1', '1', 'none', 'composite', 'true', 'true', 'parent', 'id', 'fk_user_id')
      ),
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'role', 'id'),
     /**
      * Value description: 
      */
      'name' => new RDBAttributeDescription('name', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'role', 'name'),
    );
  }
  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null)
  {
    return new RoleRDB($oid);
  }
  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName()
  {
    return 'role';
  }
}
?>
