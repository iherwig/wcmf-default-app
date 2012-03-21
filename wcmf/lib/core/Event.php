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
namespace wcmf\lib\core;

/**
 * Event is the base class for all events.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
abstract class Event {

  private $_isStopped = false;

  /**
   * Stop further processing of the event
   */
  public function stopPropagation() {
    $this->_isStopped = true;
  }

  /**
   * Check if the event is stopped
   * @return Boolean
   */
  public function isStopped() {
    return $this->_isStopped;
  }
}
?>
