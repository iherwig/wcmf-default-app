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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Fri May 24 19:15:57 CEST 2013.
 * Manual modifications should be placed inside the protected regions.
 */
namespace testapp\application\model\wcmf;

use testapp\application\model\wcmf\Translation;

use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;
use wcmf\lib\persistence\ReferenceDescription;
use wcmf\lib\persistence\ObjectId;

/**
 * @class TranslationRDBMapper
 * TranslationRDBMapper maps Translation Nodes to the database.
 * Translation description: Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.
 *
 * @author 
 * @version 1.0
 */
class TranslationRDBMapper extends NodeUnifiedRDBMapper {

  /**
   * @see RDBMapper::getType()
   */
  public function getType() {
    return 'testapp.application.model.wcmf.Translation';
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
      'display_value' => 'objectid|attribute|language',
      'parent_order' => '',
      'child_order' => '',
// PROTECTED REGION ID(testapp/application/model/wcmf/TranslationRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }

  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null) {
    return null;
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'translation', 'id'),
     /**
      * Value description: The object id of the object to which the translation belongs
      */
      'objectid' => new RDBAttributeDescription('objectid', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', '', false, 'text', 'text', 'translation', 'objectid'),
     /**
      * Value description: The attribute of the object that is translated
      */
      'attribute' => new RDBAttributeDescription('attribute', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', '', false, 'text', 'text', 'translation', 'attribute'),
     /**
      * Value description: The translation
      */
      'translation' => new RDBAttributeDescription('translation', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', '', false, 'textarea', 'text', 'translation', 'translation'),
     /**
      * Value description: The language of the translation
      */
      'language' => new RDBAttributeDescription('language', 'String', array('DATATYPE_ATTRIBUTE'), null, '', '', '', false, 'text', 'text', 'translation', 'language'),
    );
  }

  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null) {
    return new Translation($oid);
  }

  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName() {
    return 'translation';
  }
}
?>
