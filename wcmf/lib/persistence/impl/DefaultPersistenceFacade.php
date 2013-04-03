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
namespace wcmf\lib\persistence\impl;

use wcmf\lib\config\ConfigurationException;
use wcmf\lib\core\IllegalArgumentException;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\persistence\BuildDepth;
use wcmf\lib\persistence\PersistenceFacade;
use wcmf\lib\persistence\PersistenceMapper;
use wcmf\lib\persistence\PersistentObject;
use wcmf\lib\persistence\ObjectId;
use wcmf\lib\persistence\PagingInfo;
use wcmf\lib\persistence\StateChangeEvent;
use wcmf\lib\persistence\output\OutputStrategy;

/**
 * Default PersistenceFacade implementation.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class DefaultPersistenceFacade implements PersistenceFacade {

  private $_mappers = array();
  private $_simpleToFqNames = array();
  private $_createdOIDs = array();
  private $_logging = false;
  private $_logStrategy = null;
  private $_isReadOnly = false;
  private $_currentTransaction = null;

  /**
   * Constructor
   */
  public function __construct() {
    // register as change listener to track the created oids, after save
    ObjectFactory::getInstance('eventManager')->addListener(StateChangeEvent::NAME,
            array($this, 'stateChanged'));
  }

  /**
   * Destructor
   */
  public function __destruct() {
    ObjectFactory::getInstance('eventManager')->removeListener(StateChangeEvent::NAME,
            array($this, 'stateChanged'));
  }

  /**
   * Set the PersistentMapper instances.
   * @param mappers Associative array with the fully qualified
   *   mapped class names as keys and the mapper instances as values
   */
  public function setMappers($mappers) {
    $this->_mappers = $mappers;
    // register simple type names
    foreach ($mappers as $fqName => $mapper) {
      $name = $this->getSimpleType($fqName);
      if (!isset($this->_mappers[$name])) {
        $this->_mappers[$name] = $mapper;
        $this->_simpleToFqNames[$name] = $fqName;
      }
    }
  }

  /**
   * Set the OutputStrategy used for logging persistence actions.
   * @param logStrategy
   */
  public function setLogStrategy(OutputStrategy $logStrategy) {
    $this->_logStrategy = $logStrategy;
  }

  /**
   * @see PersistenceFacade::getKnownTypes()
   */
  public function getKnownTypes() {
    return array_values($this->_simpleToFqNames);
  }

  /**
   * @see PersistenceFacade::isKnownType()
   */
  public function isKnownType($type) {
    return (isset($this->_mappers[$type]));
  }

  /**
   * @see PersistenceFacade::getFullyQualifiedType()
   */
  public function getFullyQualifiedType($type) {
    if (isset($this->_simpleToFqNames[$type])) {
      return $this->_simpleToFqNames[$type];
    }
    if ($this->isKnownType($type)) {
      return $type;
    }
    throw new ConfigurationException("Type '".$type."' is unknown.");
  }

  /**
   * @see PersistenceFacade::getSimpleType()
   */
  public function getSimpleType($type) {
    $pos = strrpos($type, '\\');
    if ($pos !== false) {
      return substr($type, $pos+1);
    }
    return $type;
  }

  /**
   * @see PersistenceFacade::load()
   */
  public function load(ObjectId $oid, $buildDepth=BuildDepth::SINGLE, $buildAttribs=null, $buildTypes=null) {
    if ($buildDepth < 0 && !in_array($buildDepth, array(BuildDepth::INFINITE, BuildDepth::SINGLE))) {
      throw new IllegalArgumentException("Build depth not supported: $buildDepth", __FILE__, __LINE__);
    }
    $this->checkArrayParameter($buildAttribs, 'buildAttribs');
    $this->checkArrayParameter($buildTypes, 'buildTypes');

    // check if the object is already part of the transaction
    $transaction = $this->getTransaction();
    // extract type specific build attribs
    $attribs = null;
    if ($buildAttribs !== null) {
      // either fully qualified or simple type may be included
      $type = $oid->getType();
      $simpleType = $this->getSimpleType($type);
      $attribs = isset($buildAttribs[$type]) ? $buildAttribs[$type] :
        (isset($buildAttribs[$simpleType]) ? $buildAttribs[$simpleType] : $attribs);
    }
    $obj = $transaction->getLoaded($oid, $attribs);

    // if not cached, load
    if ($obj == null) {
      $mapper = $this->getMapper($oid->getType());
      if ($mapper != null) {
        $obj = $mapper->load($oid, $buildDepth, $buildAttribs, $buildTypes);
      }
      if ($obj != null) {
        // prepare the object (readonly/locked)
        if ($this->_isReadOnly) {
          $obj->setImmutable();
        }
      }
    }
    return $obj;
  }

  /**
   * @see PersistenceFacade::create()
   */
  public function create($type, $buildDepth=BuildDepth::SINGLE) {
    if ($buildDepth < 0 && !in_array($buildDepth, array(BuildDepth::INFINITE, BuildDepth::SINGLE, BuildDepth::REQUIRED))) {
      throw new IllegalArgumentException("Build depth not supported: $buildDepth");
    }

    $obj = null;
    $mapper = $this->getMapper($type);
    if ($mapper != null) {
      $obj = $mapper->create($type, $buildDepth);

      // register the object with the transaction, if it is active
      $transaction = $this->getTransaction();
      if ($transaction->isActive()) {
        $transaction->registerNew($obj);
      }
    }

    return $obj;
  }

  /**
   * @see PersistenceFacade::getLastCreatedOID()
   */
  public function getLastCreatedOID($type) {
    if (isset($this->_createdOIDs[$type]) && sizeof($this->_createdOIDs[$type]) > 0) {
      return $this->_createdOIDs[$type][sizeof($this->_createdOIDs[$type])-1];
    }
    return null;
  }

  /**
   * @see PersistenceFacade::getOIDs()
   */
  public function getOIDs($type, $criteria=null, $orderby=null, PagingInfo $pagingInfo=null) {
    $this->checkArrayParameter($criteria, 'criteria');
    $this->checkArrayParameter($orderby, 'orderby');

    $result = array();
    $mapper = $this->getMapper($type);
    if ($mapper != null) {
      $result = $mapper->getOIDs($type, $criteria, $orderby, $pagingInfo);
    }
    return $result;
  }

  /**
   * @see PersistenceFacade::getFirstOID()
   */
  public function getFirstOID($type, $criteria=null, $orderby=null, PagingInfo $pagingInfo=null) {
    if ($pagingInfo == null) {
      $pagingInfo = new PagingInfo(1);
    }
    $oids = $this->getOIDs($type, $criteria, $orderby, $pagingInfo);
    if (sizeof($oids) > 0) {
      return $oids[0];
    }
    else {
      return null;
    }
  }

  /**
   * @see PersistenceFacade::loadObjects()
   */
  public function loadObjects($type, $buildDepth=BuildDepth::SINGLE, $criteria=null, $orderby=null, PagingInfo $pagingInfo=null,
    $buildAttribs=null, $buildTypes=null) {
    $this->checkArrayParameter($criteria, 'criteria');
    $this->checkArrayParameter($orderby, 'orderby');

    $result = array();
    $mapper = $this->getMapper($type);
    if ($mapper != null) {
      $result = $mapper->loadObjects($type, $buildDepth, $criteria, $orderby, $pagingInfo, $buildAttribs, $buildTypes);
      foreach($result as $obj) {
        if ($obj != null) {
          // prepare the object (readonly/locked)
          if ($this->_isReadOnly) {
            $obj->setImmutable();
          }
        }
      }
    }
    return $result;
  }

  /**
   * @see PersistenceFacade::loadFirstObject()
   */
  public function loadFirstObject($type, $buildDepth=BuildDepth::SINGLE, $criteria=null, $orderby=null, PagingInfo $pagingInfo=null,
    $buildAttribs=null, $buildTypes=null) {
    if ($pagingInfo == null) {
      $pagingInfo = new PagingInfo(1);
    }
    $objects = $this->loadObjects($type, $buildDepth, $criteria, $orderby, $pagingInfo, $buildAttribs, $buildTypes);
    if (sizeof($objects) > 0) {
      return $objects[0];
    }
    else {
      return null;
    }
  }

  /**
   * @see PersistenceFacade::getTransaction()
   */
  public function getTransaction() {
    if ($this->_currentTransaction == null) {
      $this->_currentTransaction = ObjectFactory::getInstance('transaction');
    }
    return $this->_currentTransaction;
  }

  /**
   * @see PersistenceFacade::getMapper()
   */
  public function getMapper($type) {
    if ($this->isKnownType($type)) {
      $mapper = $this->_mappers[$type];
      // enable logging if desired
      if ($this->isLogging() && !$mapper->isLogging()) {
        $mapper->enableLogging($this->_logStrategy);
      }
      return $mapper;
    }
    else {
      throw new ConfigurationException("No PersistenceMapper found in configfile for type '".$type."'");
    }
  }

  /**
   * @see PersistenceFacade::setMapper()
   */
  public function setMapper($type, PersistenceMapper $mapper) {
    $this->_mappers[$type] = $mapper;
  }

  /**
   * @see PersistenceFacade::setMapper()
   */
  public function setLogging($isLogging) {
    $this->_logging = $isLogging;
  }

  /**
   * @see PersistenceFacade::isLogging()
   */
  public function isLogging() {
    return $this->_logging;
  }

  /**
   * @see PersistenceFacade::setReadOnly()
   */
  public function setReadOnly($isReadOnly) {
    $this->_isReadOnly = $isReadOnly;
  }

  /**
   * Check if the given value is either null or an array and
   * throw an exception if not
   * @param param The parameter
   * @param name The name of the parameter (used in the exception text)
   */
  private function checkArrayParameter($param, $paramName) {
    if ($param != null && !is_array($param)) {
      throw new IllegalArgumentException("The parameter '".$paramName.
              "' is expected to be null or an array");
    }
  }

  /**
   * Listen to StateChangeEvents
   * @param event StateChangeEvent instance
   */
  public function stateChanged(StateChangeEvent $event) {
    $oldState = $event->getOldValue();
    $newState = $event->getNewValue();
    // store the object id in the internal registry if the object was saved after creation
    if ($oldState == PersistentObject::STATE_NEW && $newState == PersistentObject::STATE_CLEAN) {
      $object = $event->getObject();
      $type = $object->getType();
      if (!array_key_exists($type, $this->_createdOIDs)) {
        $this->_createdOIDs[$type] = array();
      }
      array_push($this->_createdOIDs[$type], $object->getOID());
    }
  }
}
?>