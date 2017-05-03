<?php
/**
 * This file was generated by ChronosGenerator wcmf-1.0.15.0001 from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\controller;

use app\src\controller\_base\RootControllerBase;
// PROTECTED REGION ID(app/src/controller/RootController.php/Import) ENABLED START
use wcmf\lib\config\Configuration;
use wcmf\lib\config\ConfigurationException;
use wcmf\lib\core\Session;
use wcmf\lib\i18n\Localization;
use wcmf\lib\i18n\Message;
use wcmf\lib\io\FileUtil;
use wcmf\lib\persistence\PersistenceFacade;
use wcmf\lib\presentation\ActionMapper;
use wcmf\lib\security\PermissionManager;
use wcmf\lib\security\principal\impl\DefaultPrincipalFactory;
use wcmf\lib\security\principal\PrincipalFactory;
use wcmf\lib\util\StringUtil;
use wcmf\lib\util\URIUtil;
// PROTECTED REGION END

/**
 * RootController
 *
 * The following configuration settings are defined for this controller:
 *
 * [actionmapping]
 * ??cms = app\src\controller\RootController::renderPage
 *
 * [views]
 * app\src\controller\RootController?? = app/src/views/cms.tpl
 */
class RootController extends RootControllerBase {
// PROTECTED REGION ID(app/src/controller/RootController.php/Body) ENABLED START
  private $principalFactory = null;

  /**
   * Constructor
   * @param $session
   * @param $persistenceFacade
   * @param $permissionManager
   * @param $actionMapper
   * @param $localization
   * @param $message
   * @param $configuration
   * @param $principalFactory
   */
  public function __construct(Session $session,
          PersistenceFacade $persistenceFacade,
          PermissionManager $permissionManager,
          ActionMapper $actionMapper,
          Localization $localization,
          Message $message,
          Configuration $configuration,
          PrincipalFactory $principalFactory) {
    parent::__construct($session, $persistenceFacade, $permissionManager,
            $actionMapper, $localization, $message, $configuration);
    $this->principalFactory = $principalFactory;
  }
// PROTECTED REGION END

  /**
   * Render the CMS page.
   */
  protected function renderPage() {
// PROTECTED REGION ID(app/src/controller/RootController.php/Methods/renderPage) ENABLED START
    $response = $this->getResponse();

    // get configuration values
    $configuration = $this->getConfiguration();
    $appTitle = $configuration->getValue('title', 'application');
    $appColor = $configuration->getValue('color', 'application');
    $rootTypes = $configuration->getValue('rootTypes', 'application');
    $uiLanguage = $configuration->getValue('language', 'message');
    $defaultLanguage = $configuration->getValue('defaultLanguage', 'localization');
    $languages = $configuration->getSection('languages');
    $mediaAbsPath = $configuration->getDirectoryValue('uploadDir', 'media');
    $inputTypes = $configuration->getSection('inputTypes');
    $displayTypes = $configuration->getSection('displayTypes');

    if ($this->principalFactory instanceof DefaultPrincipalFactory) {
      $roleType = $configuration->getValue('roleType', 'principalFactory');
      $userType = $configuration->getValue('userType', 'principalFactory');
    }
    else {
      $userType = '';
      $roleType = '';
    }

    if ($configuration->hasValue('permissionType', 'defaultPermissionManager')) {
      $permissionType = $configuration->getValue('permissionType', 'defaultPermissionManager');
    }
    else {
      $permissionType = '';
    }

    // validate config
    if (!is_array($rootTypes) || sizeof($rootTypes) == 0) {
      throw new ConfigurationException("No root types defined.");
    }

    // usefull path variables
    $pathPrefix = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
    $basePath = !preg_match('/\/$/', $pathPrefix) ? $pathPrefix.'/' : $pathPrefix;
    $baseHref = str_replace('\\', '/', dirname(URIUtil::getProtocolStr().$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']).'/');
    $wcmfBaseHref = URIUtil::getProtocolStr().$_SERVER['HTTP_HOST'].
            str_replace(FileUtil::realpath($_SERVER['DOCUMENT_ROOT']), '', FileUtil::realpath(WCMF_BASE)).'/';
    $mediaPathRelScript = URIUtil::makeRelative($mediaAbsPath, dirname(FileUtil::realpath($_SERVER['SCRIPT_FILENAME'])).'/');
    $mediaPathRelBase = URIUtil::makeRelative($mediaAbsPath, WCMF_BASE);

    // create background image
    $geopattern = new \RedeyeVentures\GeoPattern\GeoPattern();
    $generators = ['hexagons', 'chevrons', 'overlapping_circles'];
    $geopattern->setString('1234567890123456789012345678901234567890');
    $geopattern->setBaseColor('#2F2F2F');
    $geopattern->setColor($appColor);
    $geopattern->setGenerator($generators[array_rand($generators)]);

    // load version info
    $version = 'dev';
    $buildInfoFile = WCMF_BASE.'build.info';
    if (file_exists($buildInfoFile)) {
      $buildInfo = @parse_ini_file($buildInfoFile);
      $version = $buildInfo['version'].'.'.$buildInfo['build'];
    }

    // define client configuration
    $clientConfig = [
      'title' => $appTitle,
      'color' => $appColor,
      'background' => $geopattern->toDataURL(),
      'wcmfBaseHref' => $wcmfBaseHref,
      'backendUrl' => $basePath,
      'cookiePrefix' => strtolower(StringUtil::slug($appTitle)),
      'rootTypes' => $rootTypes,
      'pathPrefix' => $basePath,
      'mediaBaseUrl' => URIUtil::makeAbsolute($mediaPathRelScript, $baseHref),
      'mediaBasePath' => $mediaPathRelScript,
      'mediaSavePath' => $mediaPathRelBase,
      'uiLanguage' => $uiLanguage,
      'defaultLanguage' => $defaultLanguage,
      'languages' => $languages,
      'inputTypes' => $inputTypes,
      'displayTypes' => $displayTypes,
      'userType' => $userType,
      'roleType' => $roleType,
      'permissionType' => $permissionType
    ];

    $response->setValue('appTitle', $appTitle);
    $response->setValue('baseHref', $baseHref);
    $response->setValue('uiLanguage', $uiLanguage);
    $response->setValue('clientConfig', json_encode($clientConfig));
    $response->setValue('version', $version);
// PROTECTED REGION END
  }

  /**
   * Get the validator description for the given parameter.
   * @param $parameter The name of the parameter
   * @param $type The type of the parameter (e.g. String)
   * @return String to be used as validateDesc parameter in Validator::validate()
   */
  protected function getValidator($parameter, $type) {
// PROTECTED REGION ID(app/src/controller/RootController.php/getValidator) ENABLED START
    return null;
// PROTECTED REGION END
  }
}
