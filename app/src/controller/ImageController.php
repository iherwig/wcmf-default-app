<?php
/**
 * This file was generated by ChronosGenerator wcmf-1.0.25.0001 from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\controller;

use app\src\controller\_base\ImageControllerBase;
// PROTECTED REGION ID(app/src/controller/ImageController.php/Import) ENABLED START
use wcmf\lib\io\ImageUtil;
// PROTECTED REGION END

/**
 * ImageController
 *
 * The following configuration settings are defined for this controller:
 *
 * [actionmapping]
 * ?image? = app\src\controller\ImageController::createImage
 *
 * [views]
 */
class ImageController extends ImageControllerBase {
// PROTECTED REGION ID(app/src/controller/ImageController.php/Body) ENABLED START
// PROTECTED REGION END

  /**
   * Create the resized and cached image.
   * @param [in] location The target location pointing into the cache directory
   */
  protected function createImage($location) {
// PROTECTED REGION ID(app/src/controller/ImageController.php/Methods/createImage) ENABLED START
    $file = ImageUtil::getCachedImage($location, true);
    $this->getResponse()->setFile($file, false);
// PROTECTED REGION END
  }

  /**
   * Get the validator description for the given parameter.
   * @param $parameter The name of the parameter
   * @param $type The type of the parameter (e.g. String)
   * @return String to be used as validateDesc parameter in Validator::validate()
   */
  protected function getValidator($parameter, $type) {
// PROTECTED REGION ID(app/src/controller/ImageController.php/getValidator) ENABLED START
    if ($parameter == 'location') {
      // FILTER_SANITIZE_STRING, FILTER_FLAG_STRIP_LOW
      return 'required,filter:{"type":"string","options":{"flags":4}}';
    }
    return parent::getValidator($parameter, $type);
// PROTECTED REGION END
  }
}
