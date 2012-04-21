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
namespace wcmf\application\controller;

use wcmf\lib\core\Log;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\i18n\Localization;
use wcmf\lib\model\NodeUtil;
use wcmf\lib\persistence\BuildDepth;
use wcmf\lib\persistence\ObjectId;
use wcmf\lib\persistence\PersistenceAction;
use wcmf\lib\persistence\PersistenceFacade;
use wcmf\lib\persistence\concurrency\ConcurrencyManager;
use wcmf\lib\persistence\concurrency\Lock;
use wcmf\lib\presentation\Controller;
use wcmf\lib\security\RightsManager;

/**
 * DisplayController is used to read a node.
 *
 * <b>Input actions:</b>
 * - unspecified: Display given Node if an oid is given
 *
 * <b>Output actions:</b>
 * - @em failure If a fatal error occurs
 * - @em ok In any other case
 *
 * @param[in] oid The oid of the requested object
 * @param[in] depth The number of levels referenced objects must be returned
 *                    as complete objects. Below this level, objects are returned as references.
 *                    If omitted, 1 is assumed. The value -1 has the special meaning of unlimited depth.
 *
 * @param[in] translateValues True/False. If true, list values will be translated using Control::translateValue. If not given,
 *                        all values will be returned as is.
 *
 * @param[out] object The Node object to display
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class DisplayController extends Controller {

  /**
   * @see Controller::validate()
   */
  protected function validate() {
    $request = $this->getRequest();
    $response = $this->getResponse();
    $oid = ObjectId::parse($request->getValue('oid'));
    if(!$oid) {
      $response->addError(ApplicationError::get('OID_INVALID',
        array('invalidOids' => array($request->getValue('oid')))));
      return false;
    }
    if($request->hasValue('depth')) {
      $depth = intval($request->getValue('depth'));
      if ($depth < -1) {
        $response->addError(ApplicationError::get('DEPTH_INVALID'));
      }
    }
    return true;
  }

  /**
   * Assign Node data to View.
   * @return False in every case.
   * @see Controller::executeKernel()
   */
  protected function executeKernel() {
    $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
    $rightsManager = RightsManager::getInstance();
    $concurrencyManager = ConcurrencyManager::getInstance();
    $request = $this->getRequest();
    $response = $this->getResponse();

    // load model
    $oid = ObjectId::parse($request->getValue('oid'));
    if ($oid && $rightsManager->authorize($oid, '', PersistenceAction::READ)) {
      // determine the builddepth
      $buildDepth = BuildDepth::SINGLE;
      if ($request->hasValue('depth')) {
        $buildDepth = $request->getValue('depth');
      }
      $node = $persistenceFacade->load($oid, $buildDepth);
      $concurrencyManager->aquireLock($oid, Lock::TYPE_OPTIMISTIC, $node);

      // translate all nodes to the requested language if requested
      if ($this->isLocalizedRequest()) {
        $localization = Localization::getInstance();
        $localization->loadTranslation($node, $request->getValue('language'), true, true);
      }

      if (Log::isDebugEnabled(__CLASS__)) {
        Log::debug(nl2br($node->toString()), __CLASS__);
      }

      // translate values if requested
      if ($request->getBooleanValue('translateValues')) {
        $nodes = array($node);
        if ($this->isLocalizedRequest()) {
          NodeUtil::translateValues($nodes, $request->getValue('language'));
        }
        else {
          NodeUtil::translateValues($nodes);
        }
      }

      // assign node data
      $response->setValue('object', $node);
    }
    // success
    $response->setAction('ok');
    return false;
  }
}
?>
