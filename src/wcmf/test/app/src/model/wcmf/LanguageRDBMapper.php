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
namespace wcmf\test\app\src\model\wcmf;

use wcmf\test\app\src\model\wcmf\Language;

use wcmf\lib\i18n\Message;
use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;
use wcmf\lib\persistence\ReferenceDescription;
use wcmf\lib\persistence\ObjectId;

/**
 * @class LanguageRDBMapper
 * LanguageRDBMapper maps Language Nodes to the database.
 * Language description: A language for which a translation of the model can be created. The code is arbitrary but it is recommended to use the ISO language codes (en, de, it, ...).
 *
 * @author 
 * @version 1.0
 */
class LanguageRDBMapper extends NodeUnifiedRDBMapper {

  /**
   * @see RDBMapper::getType()
   */
  public function getType() {
    return 'wcmf.test.app.src.model.wcmf.Language';
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
      'display_value' => 'name',
      'parent_order' => '',
      'child_order' => '',
// PROTECTED REGION ID(wcmf/test/app/src/model/wcmf/LanguageRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }

  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null) {
    $orderDefs = array();
    $orderDefs[] = array('sortFieldName' => 'name', 'sortDirection' => 'ASC', 'isSortkey' => false);
    return $orderDefs;
  }

  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions() {
    return array(
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'Language', 'id'),
     /**
      * Value description: 
      */
      'name' => new RDBAttributeDescription('name', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', false, 'text', 'text', 'Language', 'name'),
     /**
      * Value description: 
      */
      'code' => new RDBAttributeDescription('code', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', false, 'text', 'text', 'Language', 'code'),
    );
  }

  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null) {
    return new Language($oid);
  }

  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName() {
    return 'Language';
  }
}
?>
