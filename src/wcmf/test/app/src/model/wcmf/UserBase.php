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

use wcmf\lib\security\principal\impl\AbstractUser;

use wcmf\lib\i18n\Message;
use wcmf\lib\persistence\ObjectId;

/**
 * @class User
 * User description: 
 *
 * @author 
 * @version 1.0
 */
class UserBase extends AbstractUser {

    /**
     * Constructor
     * @param oid ObjectId instance (optional)
     */
    public function __construct($oid=null) {
      if ($oid == null) {
        $oid = new ObjectId('User');
    }
      parent::__construct($oid);
    }

    /**
     * @see PersistentObject::getObjectDisplayName()
     */
    public function getObjectDisplayName() {
      return Message::get("User");
    }

    /**
     * @see PersistentObject::getObjectDescription()
     */
    public function getObjectDescription() {
      return Message::get("");
    }

    /**
     * @see PersistentObject::getValueDisplayName()
     */
    public function getValueDisplayName($name) {
      $displayName = $name;
      if (false) {}
      elseif ($name == 'id') { $displayName = Message::get("id"); }
      elseif ($name == 'login') { $displayName = Message::get("login"); }
      elseif ($name == 'password') { $displayName = Message::get("password"); }
      elseif ($name == 'name') { $displayName = Message::get("name"); }
      elseif ($name == 'firstname') { $displayName = Message::get("firstname"); }
      elseif ($name == 'config') { $displayName = Message::get("config"); }
      return $displayName;
    }

    /**
     * @see PersistentObject::getValueDescription()
     */
    public function getValueDescription($name) {
      $description = $name;
      if (false) {}
      elseif ($name == 'id') { $description = Message::get(""); }
      elseif ($name == 'login') { $description = Message::get(""); }
      elseif ($name == 'password') { $description = Message::get(""); }
      elseif ($name == 'name') { $description = Message::get(""); }
      elseif ($name == 'firstname') { $description = Message::get(""); }
      elseif ($name == 'config') { $description = Message::get(""); }
      return $description;
    }

    /**
     * Get the Locktable instances in the Locktable relation
     * @return Array of Locktable instances
     */
    public function getLocktableList() {
      return $this->getValue('Locktable');
    }

    /**
     * Set the Locktable instances in the Locktable relation
     * @param nodeList Array of Locktable instances
     */
    public function setLocktableList(array $nodeList) {
      $this->setValue('Locktable', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'Locktable');
      }
    }
    /**
     * Get the UserConfig instances in the UserConfig relation
     * @return Array of UserConfig instances
     */
    public function getUserConfigList() {
      return $this->getValue('UserConfig');
    }

    /**
     * Set the UserConfig instances in the UserConfig relation
     * @param nodeList Array of UserConfig instances
     */
    public function setUserConfigList(array $nodeList) {
      $this->setValue('UserConfig', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'UserConfig');
      }
    }
    /**
     * Get the Role instances in the Role relation
     * @return Array of Role instances
     */
    public function getRoleList() {
      return $this->getValue('Role');
    }

    /**
     * Set the Role instances in the Role relation
     * @param nodeList Array of Role instances
     */
    public function setRoleList(array $nodeList) {
      $this->setValue('Role', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'Role');
      }
    }
}
?>
