<?php
/*
 * Copyright (c) 2013 The Olympos Development Team.
 * 
 * http://sourceforge.net/projects/olympos/
 * 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html. If redistributing this code,
 * this entire header must remain intact.
 */

/**
 * This file was generated by ChronosGenerator  from cwm-export.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\model\wcmf;

use app\src\model\wcmf\NMUserRole;

use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;
use wcmf\lib\persistence\ReferenceDescription;
use wcmf\lib\persistence\ObjectId;

/**
 * @class NMUserRoleRDBMapper
 * NMUserRoleRDBMapper maps NMUserRole Nodes to the database.
 * NMUserRole description: ?
 *
 * @author 
 * @version 1.0
 */
class NMUserRoleRDBMapper extends NodeUnifiedRDBMapper {

  /**
   * @see RDBMapper::getType()
   */
  public function getType() {
    return 'app.src.model.wcmf.NMUserRole';
  }

  /**
   * @see PersistenceMapper::getPkNames()
   */
  public function getPkNames() {
    return array('fk_user_id', 'fk_role_id');
  }

  /**
   * @see PersistenceMapper::getProperties()
   */
  public function getProperties() {
    return array(
      'manyToMany' => array('Role', 'User'),
      'is_searchable' => false,
      'display_value' => '',
      'parent_order' => '',
      'child_order' => '',
// PROTECTED REGION ID(app/src/model/wcmf/NMUserRoleRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }

  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null) {
    $orderDefs = array();
    $orderDefs[] = array('sortFieldName' => 'none', 'sortDirection' => 'ASC', 'isSortkey' => false);
    return $orderDefs;
  }

  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions() {
    return array(
      'Role' => new RDBManyToOneRelationDescription(
        'app.src.model.wcmf.NMUserRole', 'NMUserRole', 'app.src.model.wcmf.Role', 'Role',
        '0', 'unbounded', '1', '1', 'composite', 'none', 'true', 'true', 'parent', 'id', 'fk_role_id'
      ),
      'User' => new RDBManyToOneRelationDescription(
        'app.src.model.wcmf.NMUserRole', 'NMUserRole', 'app.src.model.wcmf.User', 'User',
        '0', 'unbounded', '1', '1', 'composite', 'none', 'true', 'true', 'parent', 'id', 'fk_user_id'
      ),
    );
  }

  /**
   * @see RDBMapper::getAttributeDescriptions()
   */
  protected function getAttributeDescriptions() {
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
  protected function createObject(ObjectId $oid=null) {
    return new NMUserRole($oid);
  }

  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName() {
    return 'nm_user_role';
  }
}
?>
