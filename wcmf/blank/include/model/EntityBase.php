<?php
/**
 * This file was generated by wCMFGenerator 3.0.0017 from newroles.uml on Fri Jun 10 17:44:16 CEST 2011.
 * Manual modifications should be placed inside the protected regions.
 */
namespace application\model;

use application\model\EntityBaseBase;
use wcmf\lib\security\RightsManager;
// PROTECTED REGION ID(application/include/model/EntityBase.php/Import) ENABLED START
// PROTECTED REGION END

/**
 * @class EntityBase
 * EntityBase description:
 *
 * @author
 * @version 1.0
 */
class EntityBase extends EntityBaseBase
{
// PROTECTED REGION ID(application/include/model/EntityBase.php/Body) ENABLED START
  /**
   * Set creator and created attribute on the node.
   */
  public function beforeInsert()
  {
    parent::beforeInsert();

    // set creation date on nodes with appropriate attribute
    if ($this->hasValue('created')) {
      $this->setValue('created', date("Y-m-d H:i:s"));
    }
    // set creator on nodes with appropriate attribute
    if ($this->hasValue('creator'))
    {
      $rightsManager = RightsManager::getInstance();
      $authUser = $rightsManager->getAuthUser();
      $this->setValue('creator', $authUser->getLogin());
    }
    $this->beforeUpdate();
  }
  /**
   * Set last_editor and modified attribute on the node.
   */
  public function beforeUpdate()
  {
    parent::beforeUpdate();

    // set modified date on nodes with appropriate attribute
    if ($this->hasValue('modified')) {
      $this->setValue('modified', date("Y-m-d H:i:s"));
    }
    // set last_editor on nodes with appropriate attribute
    if ($this->hasValue('last_editor'))
    {
      $rightsManager = RightsManager::getInstance();
      $authUser = $rightsManager->getAuthUser();
      $this->setValue('last_editor', $authUser->getLogin());
    }
  }
// PROTECTED REGION END
}
?>
