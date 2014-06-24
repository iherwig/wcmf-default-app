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
namespace app\src\model;

use app\src\model\NMPublisherAuthor;

use wcmf\lib\i18n\Message;
use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;
use wcmf\lib\persistence\ReferenceDescription;
use wcmf\lib\persistence\ObjectId;

/**
 * @class NMPublisherAuthorRDBMapper
 * NMPublisherAuthorRDBMapper maps NMPublisherAuthor Nodes to the database.
 * NMPublisherAuthor description: 
 *
 * @author 
 * @version 1.0
 */
class NMPublisherAuthorRDBMapper extends NodeUnifiedRDBMapper {

  /**
   * @see RDBMapper::getType()
   */
  public function getType() {
    return 'app.src.model.NMPublisherAuthor';
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
      'manyToMany' => array('Publisher', 'Author'),
      'is_searchable' => false,
      'display_value' => '',
      'parent_order' => '',
      'child_order' => '',
// PROTECTED REGION ID(app/src/model/NMPublisherAuthorRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }

  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null) {
    $orderDefs = array();
    if ($roleName == 'Publisher') {
      $orderDefs[] = array('sortFieldName' => 'sortkey_publisher', 'sortDirection' => 'ASC', 'isSortkey' => true);
    }
    if ($roleName == 'Author') {
      $orderDefs[] = array('sortFieldName' => 'sortkey_author', 'sortDirection' => 'ASC', 'isSortkey' => true);
    }
    if ($roleName == null) {
      $orderDefs[] = array('sortFieldName' => 'sortkey', 'sortDirection' => 'ASC', 'isSortkey' => true);
    }
    return $orderDefs;
  }

  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions() {
    return array(
      'Publisher' => new RDBManyToOneRelationDescription(
        'app.src.model.NMPublisherAuthor', 'NMPublisherAuthor', 'app.src.model.Publisher', 'Publisher',
        '0', 'unbounded', '1', '1', 'composite', 'none', 'true', 'true', 'parent', 'id', 'fk_publisher_id'
      ),
      'Author' => new RDBManyToOneRelationDescription(
        'app.src.model.NMPublisherAuthor', 'NMPublisherAuthor', 'app.src.model.Author', 'Author',
        '0', 'unbounded', '1', '1', 'composite', 'none', 'true', 'true', 'parent', 'id', 'fk_author_id'
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'NMPublisherAuthor', 'id'),
     /**
      * Value description: 
      */
      'fk_author_id' => new RDBAttributeDescription('fk_author_id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'NMPublisherAuthor', 'fk_author_id'),
     /**
      * Value description: 
      */
      'fk_publisher_id' => new RDBAttributeDescription('fk_publisher_id', '', array('DATATYPE_IGNORE'), null, '', '', false, 'text', 'text', 'NMPublisherAuthor', 'fk_publisher_id'),
      /**
       * Value description: Sort key for ordering in relation to Publisher
       */
      'sortkey_publisher' => new RDBAttributeDescription('sortkey_publisher', 'integer', array('DATATYPE_IGNORE'), null, 'regexp:[0-9]*', '', true, 'text[class="tiny"]', 'text', 'NMPublisherAuthor', 'sortkey_publisher'),
      /**
       * Value description: Sort key for ordering in relation to Author
       */
      'sortkey_author' => new RDBAttributeDescription('sortkey_author', 'integer', array('DATATYPE_IGNORE'), null, 'regexp:[0-9]*', '', true, 'text[class="tiny"]', 'text', 'NMPublisherAuthor', 'sortkey_author'),
      /**
       * Value description: Sort key for ordering
       */
      'sortkey' => new RDBAttributeDescription('sortkey', 'integer', array('DATATYPE_IGNORE'), null, 'regexp:[0-9]*', '', true, 'text[class="tiny"]', 'text', 'NMPublisherAuthor', 'sortkey'),
    );
  }

  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null) {
    return new NMPublisherAuthor($oid);
  }

  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName() {
    return 'NMPublisherAuthor';
  }
}
?>
