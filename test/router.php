<?php
/**
 * Router script for test server
 * NOTE: we are serving from the dist/ directory
 */
error_reporting(E_ALL | E_PARSE);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../dist').'/');

use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\core\ClassLoader;
use wcmf\lib\core\impl\DefaultFactory;
use wcmf\lib\core\impl\MonologFileLogger;
use wcmf\lib\core\LogManager;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\presentation\Application;

$requestedResource = $_SERVER["REQUEST_URI"];
if (!preg_match('/^\/$|^\/\?/', $requestedResource) || is_file(WCMF_BASE.$requestedResource)) {
  // serve the requested resource as-is.
  return false;
}
else {
  require_once(WCMF_BASE."/vendor/autoload.php");
  new ClassLoader(WCMF_BASE);

  $configPath = WCMF_BASE.'app/config/';

  // setup logging
  $logger = new MonologFileLogger('main', $configPath.'logging.ini');
  LogManager::configure($logger);

  // setup configuration
  $configuration = new InifileConfiguration($configPath);
  $configuration->addConfiguration('config.ini');
  // override connection settings in order to use testing db
  $configuration->addConfiguration('../../../test/tests.ini');

  // setup object factory
  ObjectFactory::configure(new DefaultFactory($configuration));
  ObjectFactory::registerInstance('configuration', $configuration);

  // create the application
  $application = new Application();
  try {
    // initialize the application
    $request = $application->initialize('', '', 'cms');

    // override connection settings in order to use testing db
    $configuration->addConfiguration('../../../test/tests.ini');

    // run the application
    $application->run($request);
  }
  catch (\Exception $ex) {
    try {
      $application->handleException($ex, isset($request) ? $request : null);
    }
    catch (\Exception $unhandledEx) {
      echo("An unhandled exception occured. Please see log file for details.");
    }
  }
}
?>