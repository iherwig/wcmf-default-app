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

use wcmf\lib\core\ObjectFactory;
use wcmf\lib\model\ObjectQuery;
use wcmf\lib\persistence\PersistenceFacade;
use wcmf\lib\security\Role;
use wcmf\lib\security\User;
use wcmf\lib\security\UserManager;

/**
 * DefaultUserManager is a UserManager that stores user and role information
 * in the store using their mappers. The User and Role implementation classes
 * are defined by the configuration keys 'User' and 'Role' in the
 * [implementation] section.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class DefaultUserManager extends UserManager {

  /**
   * @see UserManager::getUsersAndRoles
   */
  protected function getUsersAndRoles() {
    // load the user/role instances
    $query = new ObjectQuery(self::getUserClassName());
    $users = $query->execute(1);
    $query = new ObjectQuery(self::getRoleClassName());
    $roles = $query->execute(1);
    return array('users' => $users, 'roles' => $roles);
  }

  /**
   * @see UserManager::createUserImpl()
   */
  protected function createUserImpl($name, $firstname, $login, $password) {
    $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
    $user = $persistenceFacade->create(self::getUserClassName(), BuildDepth::REQUIRED);
    $user->setName($name);
    $user->setFirstname($firstname);
    $user->setLogin($login);
    $user->setPassword($password);
    $user->save();

    return $user;
  }

  /**
   * @see UserManager::removeUserImpl()
   */
  protected function removeUserImpl(User $user) {
    $user->delete();
  }

  /**
   * @see UserManager::setUserPropertyImpl()
   */
  protected function setUserPropertyImpl(User $user, $property, $value) {
    $user->setValue($property, $value);
    $user->save();
  }

  /**
   * @see UserManager::createRoleImpl()
   */
  protected function createRoleImpl($name) {
    $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
    $role = $persistenceFacade->create($this->getRoleClassName(), BuildDepth::REQUIRED);
    $role->setName($name);
    $role->save();

    return $role;
  }

  /**
   * @see UserManager::removeRoleImpl()
   */
  protected function removeRoleImpl(Role $role) {
    $role->delete();
  }

  /**
   * @see UserManager::setRolePropertyImpl()
   */
  protected function setRolePropertyImpl(Role $role, $property, $value) {
    $role->setValue($property, $value);
    $role->save();
  }

  /**
   * @see UserManager::addUserToRoleImpl()
   */
  protected function addUserToRoleImpl(Role $role, User $user) {
    $user->addRole($role->getName());
  }

  /**
   * @see UserManager::removeUserFromRoleImpl()
   */
  protected function removeUserFromRoleImpl(Role $role, User $user) {
    $user->removeRole($role->getName());
  }
}
?>