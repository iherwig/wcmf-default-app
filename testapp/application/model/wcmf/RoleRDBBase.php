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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Wed Feb 20 15:01:28 CET 2013. 
 * Manual modifications should be placed inside the protected regions.
 */
namespace testapp\application\model\wcmf;

use wcmf\lib\security\Role;

use wcmf\lib\i18n\Message;
use wcmf\lib\persistence\ObjectId;

/**
 * @class RoleRDB
 * RoleRDB description: ?
 *
 * @author 
 * @version 1.0
 */
class RoleRDBBase extends Role {

    /**
     * Constructor
     * @param oid ObjectId instance (optional)
     */
    public function __construct($oid=null) {
      if ($oid == null) {
        $oid = new ObjectId('RoleRDB');
    }
      parent::__construct($oid);
    }

    /**
     * @see PersistentObject::getObjectDisplayName()
     */
    public function getObjectDisplayName() {
      return Message::get("RoleRDB");
    }

    /**
     * @see PersistentObject::getObjectDescription()
     */
    public function getObjectDescription() {
      return Message::get("?");
    }

    /**
     * @see PersistentObject::getValueDisplayName()
     */
    public function getValueDisplayName($name) {
      $displayName = $name;
      if ($name == 'id') { $displayName = Message::get("id"); }
      if ($name == 'name') { $displayName = Message::get("name"); }
      return Message::get($displayName);
    }

    /**
     * @see PersistentObject::getValueDescription()
     */
    public function getValueDescription($name) {
      $description = $name;
      if ($name == 'id') { $description = Message::get(""); }
      if ($name == 'name') { $description = Message::get("?"); }
      return Message::get($description);
    }

    /**
     * Get the value of the id attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getId($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('id'); }
      else { $value = $this->getValue('id'); }
      return $value;
    }

    /**
     * Set the value of the id attribute
     * @param id The value to set
     */
    public function setId($id) {
      return $this->setValue('id', $id);
    }
    /**
     * Get the value of the name attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getName($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('name'); }
      else { $value = $this->getValue('name'); }
      return $value;
    }

    /**
     * Set the value of the name attribute
     * @param name The value to set
     */
    public function setName($name) {
      return $this->setValue('name', $name);
    }
     
    /**
     * Get the UserRDB instances in the UserRDB relation
     * @return Array of UserRDB instances
     */
    public function getUserRDBList() {
      return $this->getChildrenEx(null, 'UserRDB', null, null, null, false);
    }

    /**
     * Set the UserRDB instances in the UserRDB relation
     * @param nodeList Array of UserRDB instances
     */
    public function setUserRDBList(array $nodeList) {
      $this->setValue('UserRDB', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'UserRDB');
        }
      }
}
?>
