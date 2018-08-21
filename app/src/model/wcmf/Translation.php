<?php
/**
 * This file was generated by ChronosGenerator wcmf-1.0.24.0001 from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\model\wcmf;

use app\src\model\wcmf\_base\TranslationBase;
// PROTECTED REGION ID(app/src/model/wcmf/Translation.php/Import) ENABLED START
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\persistence\ObjectId;
// PROTECTED REGION END

/**
 * Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.
 *
 * @var id
 * @var objectid (String)
 * @var attribute (String)
 * @var translation (String)
 * @var language (String)
 */
class Translation extends TranslationBase {
// PROTECTED REGION ID(app/src/model/wcmf/Translation.php/Body) ENABLED START
  /**
   * Set last_editor and modified attribute on the node.
   */
  public function beforeUpdate() {
    parent::beforeUpdate();

    // touch localized object
    $oid = $this->getValue('objectid');
    $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
    $localizedObj = $persistenceFacade->load(ObjectId::parse($oid));
    if ($localizedObj) {
      $localizedObj->beforeUpdate();
    }
  }
// PROTECTED REGION END
}
