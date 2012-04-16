<?php
/**
 * wCMF - wemove Content Management Framework
 * Copyright (C) 2005-2009 wemove digital solutions GmbH
 *
 * Licensed under the terms of any of the following licenses
 * at your choice:
 *
 * - GNU Lesser General Public License (LGPL)
 *   http://www.gnu.org/licenses/lgpl.html
 * - Eclipse Public License (EPL)
 *   http://www.eclipse.org/org/documents/epl-v10.php
 *
 * See the license.txt file distributed with this work for
 * additional information.
 *
 * $Id$
 */
namespace wcmf\lib\security;

use wcmf\lib\security\User;

/**
 * Implementation of a system user.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class UserImpl extends User {

  /**
   * Default constructor.
   */
  public function __construct($oid=null, $type='UserImpl') {
    parent::User($oid, $type);
  }

  /**
   * Set the login of the user.
   * @param login The login of the user.
   */
  public function setLogin($login) {
    $this->setValue('login', $login);
  }

  /**
   * Get the login of the user.
   * @return The login of the user.
   */
  public function getLogin() {
    return $this->getValue('login');
  }

  /**
   * Set the password of the user.
   * @param password The unencrypted password of the user.
   */
  public function setPassword($password) {
    $this->setValue('password', $password);
  }

  /**
   * Get the password of the user.
   * @return The unencrypted password of the user.
   */
  public function getPassword() {
    return $this->getValue('password');
  }

  /**
   * Set the name of the user.
   * @param name The name of the user.
   */
  public function setName($name) {
    $this->setValue('name', $name);
  }

  /**
   * Get name of the user.
   * @return The name of the user.
   */
  public function getName() {
    return $this->getValue('name');
  }

  /**
   * Set the firstname of the user.
   * @param firstname The firstname of the user.
   */
  public function setFirstname($firstname) {
    $this->setValue('firstname', $firstname);
  }

  /**
   * Get the firstname of the user.
   * @return The firstname of the user.
   */
  public function getFirstname() {
    return $this->getValue('firstname');
  }

  /**
   * Set the configuration file of the user.
   * @param config The configuration file of the user.
   */
  public function setConfig($config) {
    $this->setValue('config', $config);
  }

  /**
   * Get the configuration file of the user.
   * @return The configuration file of the user.
   */
  public function getConfig() {
    return $this->getValue('config');
  }
}
?>