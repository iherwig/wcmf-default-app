<?php
/**
 * wCMF - wemove Content Management Framework
 * Copyright (C) 2005-2014 wemove digital solutions GmbH
 *
 * Licensed under the terms of the MIT License.
 *
 * See the LICENSE file distributed with this work for
 * additional information.
 */
error_reporting(E_ALL | E_PARSE);
$startTime = microtime(true);

define('WCMF_BASE', realpath(dirname(__FILE__).'/../..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use \Exception;
use wcmf\lib\config\ConfigurationException;
use wcmf\lib\core\Log;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\io\FileUtil;
use wcmf\lib\presentation\Application;
use wcmf\lib\util\URIUtil;
use wcmf\lib\security\principal\impl\AnonymousUser;

$application = new Application();
try {
  // initialize the application
  $request = $application->initialize(WCMF_BASE.'app/config/', 'config.ini', '', '', 'home');
  if ($request->getAction() != 'home') {
    // run the application
    $application->run($request);
    exit;
  }

  // show start screen

  // check for authenticated user
  $permissionManager = ObjectFactory::getInstance('permissionManager');
  $isLoggedIn = !($permissionManager->getAuthUser() instanceof AnonymousUser);

  // get configuration values
  $config = ObjectFactory::getConfigurationInstance();
  $appTitle = $config->getValue('applicationTitle', 'application');
  $rootTypes = $config->getValue('rootTypes', 'application');
  $uiLanguage = $config->getValue('language', 'application');
  $defaultLanguage = $config->getValue('defaultLanguage', 'localization');
  $languages = $config->getSection('languages');
  $mediaAbsPath = $config->getDirectoryValue('uploadDir', 'media');
  $inputTypes = $config->getSection('inputTypes');
  $displayTypes = $config->getSection('displayTypes');
  $userType = str_replace('\\', '.', $config->getValue('__class', 'user'));
  $roleType = str_replace('\\', '.', $config->getValue('__class', 'role'));

  // validate config
  if (!is_array($rootTypes) || sizeof($rootTypes) == 0) {
    throw new ConfigurationException("No root types defined.");
  }

  // check if the user should be redirected to the login page
  // if yes, we do this and add the requested path as route parameter
  $pathPrefix = dirname($_SERVER['SCRIPT_NAME']);
  $basePath = dirname($_SERVER['SCRIPT_NAME']).'/';
  $script = basename($_SERVER['SCRIPT_NAME']);
  $requestPath = $_SERVER['REQUEST_URI'];
  // remove basepath & script from request path to get the requested resource
  $requestedResource = strpos($requestPath, $basePath) === 0 ?
          preg_replace('/^'.$script.'/', '', str_replace($basePath, '', $requestPath)) : '';
  if (!$isLoggedIn && strlen($requestedResource) > 0 && !preg_match('/\?route=/', $requestPath)) {
    if ($requestPath != 'logout') {
      $redirectUrl = URIUtil::getProtocolStr().$_SERVER['HTTP_HOST'].$basePath.'?route='.$requestedResource;
      header("Location: ".$redirectUrl);
    }
  }
  $baseHref = dirname(URIUtil::getProtocolStr().$_SERVER['HTTP_HOST'].$_SERVER['SCRIPT_NAME']).'/';
  $mediaPath = FileUtil::getRelativePath(dirname($_SERVER['SCRIPT_FILENAME']), $mediaAbsPath);

  // define client configuration
  $clientConfig = array(
    'title' => $appTitle,
    'backendUrl' => $pathPrefix.'/main.php',
    'rootTypes' => $rootTypes,
    'pathPrefix' => $pathPrefix,
    'mediaBaseUrl' => URIUtil::makeAbsolute($mediaPath, $baseHref),
    'mediaBasePath' => $mediaPath,
    'uiLanguage' => $uiLanguage,
    'defaultLanguage' => $defaultLanguage,
    'languages' => $languages,
    'inputTypes' => $inputTypes,
    'displayTypes' => $displayTypes,
    'userType' => $userType,
    'roleType' => $roleType
  );
}
catch (Exception $ex) {
  try {
    $application->handleException($ex, isset($request) ? $request : null);
  } catch (Exception $unhandledEx) {
    $error = "An unhandled exception occured. Please see log file for details.";
  }
}
if (Log::isDebugEnabled('main')) {
  Log::debug(number_format(memory_get_peak_usage()/(1024*1024), 2)." MB used [".
        $request->getSender()."?".$request->getContext()."?".$request->getAction()."]", 'main');
  Log::debug((microtime(true) - $startTime).' seconds', 'main');
}
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title><?php echo isset($appTitle) ? $appTitle : ""; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="">
    <base href="<?php echo isset($baseHref) ? $baseHref : ""; ?>">

    <link href="css/app.css" rel="stylesheet" media="screen">

    <script>
      document.write('<style media="all">#no-js { display: none; }</style>');
    </script>
  </head>

  <body class="dbootstrap">
    <?php if (isset($error)) : ?>
    <div id="error" class="alert alert-error">
      <strong>Error!</strong> <?php echo $error; ?>
    </div>
    <?php endif; ?>

    <script>
      var appConfig = <?php echo isset($clientConfig) ? json_encode($clientConfig) : ""; ?>;

      var dojoConfig = {
          has: {
              "dijit": true
          },
          baseUrl: '',
          locale: appConfig.uiLanguage,
          async: 1,
          isDebug: 0,
          packages: [
              { name: 'dojo', location: 'vendor/dojo/dojo' },
              { name: 'dijit', location: 'vendor/dojo/dijit' },
              { name: 'dojox', location: 'vendor/dojo/dojox' },
              { name: 'routed', location: 'vendor/sirprize/routed' },
              { name: 'dojomat', location: 'vendor/sirprize/dojomat' },
              { name: 'dgrid', location: 'vendor/sitepen/dgrid' },
              { name: 'xstyle', location: 'vendor/kriszyp/xstyle' },
              { name: 'put-selector', location: 'vendor/kriszyp/put-selector' },
              { name: 'ckeditor', location: 'vendor/ckeditor/ckeditor' },
              { name: 'elfinder', location: 'vendor/studio-42/elfinder' },

              { name: 'app', location: '.' }
          ],
          'routing-map': {
              pathPrefix: appConfig.pathPrefix
          }
      };
    </script>

    <script src="vendor/dojo/dojo/dojo.js"></script>

    <script>
      require(["app/js/App"], function (App) { new App({}, 'push'); });
    </script>

    <div id="no-js" class="alert alert-error">
      <strong>Warning!</strong> Please enable JavaScript in your browser.
    </div>

    <div id="wrap">
      <div id="push"></div>
    </div>
    <div id="footer">
      <div class="container">
        <p class="pull-right muted">created with
          <a href="http://sourceforge.net/projects/wcmf/" target="_blank">wCMF</a></p>
        <p class="muted">&copy; 2014</p>
      </div>
    </div>

  </body>
</html>