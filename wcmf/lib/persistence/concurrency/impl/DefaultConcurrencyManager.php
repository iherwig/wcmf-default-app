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
namespace wcmf\lib\persistence\concurrency\impl;

use wcmf\lib\core\IllegalArgumentException;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\model\NodeValueIterator;
use wcmf\lib\persistence\BuildDepth;
use wcmf\lib\persistence\ObjectId;
use wcmf\lib\persistence\PersistentObject;
use wcmf\lib\persistence\concurrency\ConcurrencyManager;
use wcmf\lib\persistence\concurrency\Lock;
use wcmf\lib\persistence\concurrency\LockHandler;
use wcmf\lib\persistence\concurrency\OptimisticLockException;
use wcmf\lib\persistence\concurrency\PessimisticLockException;

/**
 * Default ConcurrencyManager implementation.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class DefaultConcurrencyManager implements ConcurrencyManager {

  private $_lockHandler = null;

  /**
   * Set the LockHandler used for locking.
   * @param lockHandler
   */
  public function setLockHandler(LockHandler $lockHandler) {
    $this->_lockHandler = $lockHandler;
  }

  /**
   * @see ConcurrencyManager::aquireLock()
   */
  public function aquireLock(ObjectId $oid, $type, PersistentObject $currentState=null) {
    if (!ObjectId::isValid($oid) || ($type != Lock::TYPE_OPTIMISTIC &&
            $type != Lock::TYPE_PESSIMISTIC)) {
      throw new IllegalArgumentException("Invalid object id or locktype given");
    }

    // load the current state if not provided
    if ($type == Lock::TYPE_OPTIMISTIC && $currentState == null) {
      $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
      $currentState = $persistenceFacade->load($oid, BuildDepth::SINGLE);
    }

    $this->_lockHandler->aquireLock($oid, $type, $currentState);
  }

  /**
   * @see ConcurrencyManager::releaseLock()
   */
  public function releaseLock(ObjectId $oid) {
    if (!ObjectId::isValid($oid)) {
      throw new IllegalArgumentException("Invalid object id given");
    }
    $this->_lockHandler->releaseLock($oid);
  }

  /**
   * @see ConcurrencyManager::releaseLocks()
   */
  public function releaseLocks(ObjectId $oid) {
    if (!ObjectId::isValid($oid)) {
      throw new IllegalArgumentException("Invalid object id given");
    }
    $this->_lockHandler->releaseLocks($oid);
  }

  /**
   * @see ConcurrencyManager::releaseAllLocks()
   */
  public function releaseAllLocks() {
    $this->_lockHandler->releaseAllLocks();
  }

  /**
   * @see ConcurrencyManager::checkPersist()
   */
  public function checkPersist(PersistentObject $object) {
    $oid = $object->getOID();
    $lock = $this->_lockHandler->getLock($oid);
    if ($lock != null) {
      $type = $lock->getType();

      // if there is a pessimistic lock on the object and it's not
      // owned by the current user, throw a PessimisticLockException
      if ($type == Lock::TYPE_PESSIMISTIC) {
        $permissionManager = ObjectFactory::getInstance('permissionManager');
        $currentUser = $permissionManager->getAuthUser();
        if ($lock->getUserOID() != $currentUser->getOID()) {
            throw new PessimisticLockException($lock);
        }
      }

      // if there is an optimistic lock on the object and the object was updated
      // in the meantime, throw a OptimisticLockException
      if ($type == Lock::TYPE_OPTIMISTIC) {
        $originalState = $lock->getCurrentState();
        // temporarily detach the object from the transaction in order to get
        // the latest version from the store
        $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
        $transaction = $persistenceFacade->getTransaction();
        $transaction->detach($object);
        $currentState = $persistenceFacade->load($oid, BuildDepth::SINGLE);
        // check for deletion
        if ($currentState == null) {
          throw new OptimisticLockException(null);
        }
        // check for modifications
        $it = new NodeValueIterator($originalState, false);
        foreach($it as $valueName => $originalValue) {
          $currentValue = $currentState->getValue($valueName);
          if ($currentValue != $originalValue) {
            throw new OptimisticLockException($currentState);
          }
        }
        // if there was no concurrent update, attach the object again
        if ($object->getState() == PersistentObject::STATE_DIRTY) {
          $transaction->registerDirty($object);
        }
        elseif ($object->getState() == PersistentObject::STATE_DELETED) {
          $transaction->registerDeleted($object);
        }
      }
    }
    // everything is ok
  }
}
?>