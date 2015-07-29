<?php
/**
 * Router script for test server
 * NOTE: we are serving from the dist/ directory
 */
error_reporting(E_ALL | E_PARSE);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../dist').'/');

use \Exception;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\presentation\Application;

$requestedResource = $_SERVER["REQUEST_URI"];
if (!preg_match('/^\/$|^\/\?/', $requestedResource) || is_file(WCMF_BASE.$requestedResource)) {
  // serve the requested resource as-is.
  return false;
}
else {
  require_once(WCMF_BASE."/vendor/autoload.php");

  $application = new Application(WCMF_BASE.'app/config/', 'config.ini');
  try {
    // initialize the application
    $request = $application->initialize('', '', 'cms');

    // override connection settings in order to use testing db
    $config = ObjectFactory::getConfigurationInstance();
    $config->addConfiguration('../../../test/tests.ini');

    // run the application
    $application->run($request);
  }
  catch (Exception $ex) {
    try {
      $application->handleException($ex, isset($request) ? $request : null);
    }
    catch (Exception $unhandledEx) {
      echo("An unhandled exception occured. Please see log file for details.");
    }
  }
}
?>