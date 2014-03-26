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
 * This file was generated by ChronosGenerator  from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\model\wcmf;

use app\src\model\wcmf\Locktable;

use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;
use wcmf\lib\persistence\ReferenceDescription;
use wcmf\lib\persistence\ObjectId;

/**
 * @class LocktableRDBMapper
 * LocktableRDBMapper maps Locktable Nodes to the database.
 * Locktable description: 
 *
 * @author 
 * @version 1.0
 */
class LocktableRDBMapper extends NodeUnifiedRDBMapper {

  /**
   * @see RDBMapper::getType()
   */
  public function getType() {
    return 'app.src.model.wcmf.Locktable';
  }

  /**
   * @see PersistenceMapper::getPkNames()
   */
  public function getPkNames() {
    return array('id');
  }

  /**
   * @see PersistenceMapper::getProperties()
   */
  public function getProperties() {
    return array(
      'is_searchable' => false,
      'display_value' => '',
      'parent_order' => '',
      'child_order' => '',
// PROTECTED REGION ID(app/src/model/wcmf/LocktableRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }

  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null) {
    $orderDefs = array();
    return $orderDefs;
  }

  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions() {
    return array(
      'User' => new RDBManyToOneRelationDescription(
        'app.src.model.wcmf.Locktable', 'Locktable', 'app.src.model.wcmf.User', 'User',
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'Locktable', 'id'),
     /**
      * Value description: 
      */
      'fk_user_id' => new RDBAttributeDescription('fk_user_id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'Locktable', 'fk_user_id'),
     /**
      * Value description: 
      */
      'objectid' => new RDBAttributeDescription('objectid', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', false, 'text', 'text', 'Locktable', 'objectid'),
     /**
      * Value description: 
      */
      'sessionid' => new RDBAttributeDescription('sessionid', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', false, 'text', 'text', 'Locktable', 'sessionid'),
     /**
      * Value description: 
      */
      'since' => new RDBAttributeDescription('since', 'Date', array('DATATYPE_ATTRIBUTE'), null, '', '', false, 'date', 'text', 'Locktable', 'since'),
    );
  }

  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null) {
    return new Locktable($oid);
  }

  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName() {
    return 'Locktable';
  }
}
?>
