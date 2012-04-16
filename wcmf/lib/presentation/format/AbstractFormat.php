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
namespace wcmf\lib\presentation\format;

use wcmf\lib\core\ObjectFactory;
use wcmf\lib\model\Node;
use wcmf\lib\persistence\ObjectId;
use wcmf\lib\persistence\PersistenceFacade;

/**
 * AbstractFormat maybe used as base class for specialized formats.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
abstract class AbstractFormat implements Format {

  private $_deserializedNodes = array();

  /**
   * Get a node with the given oid to deserialize values from form fields into it.
   * The method ensures that there is only one instance per oid.
   * @param oid The oid
   * @return A reference to the Node instance
   */
  protected function getNode(ObjectId $oid) {
    if (!isset($this->_deserializedNodes[$oid])) {
      $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
      $type = $oid->getType();
      if ($persistenceFacade->isKnownType($type)) {
        // don't create all values by default (-> don't use PersistenceFacade::create() directly, just for determining the class)
        $class = get_class($persistenceFacade->create($type, BuildDepth::SINGLE));
        $node = new $class;
      }
      else {
        $node = new Node($type);
      }
      $node->setOID($oid);
      $this->_deserializedNodes[$oid] = $node;
    }
    return $this->_deserializedNodes[$oid];
  }

  /**
   * Get all serialized nodes
   * @return An array of Node references
   */
  protected function getNodes() {
    return $this->_deserializedNodes;
  }
}
?>