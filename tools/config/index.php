<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>wCMF - config dump</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="../../app/public/vendor/twitter-bootstrap/css/bootstrap.css" rel="stylesheet">
  <link href="../../app/public/css/app.css" rel="stylesheet">
</head>
<?php
/**
 * This script extracts application messages from calls to Message::get
 */
error_reporting(E_ALL & ~E_NOTICE);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\core\ClassLoader;
use wcmf\lib\core\impl\MonologFileLogger;
use wcmf\lib\core\LogManager;

new ClassLoader(WCMF_BASE);

$configPath = './';

// setup logging
$logger = new MonologFileLogger('config', '../log.ini');
LogManager::configure($logger);

// setup configuration
$configuration = new InifileConfiguration($configPath);
$configuration->addConfiguration('config.ini');
$rootConfig = $configuration->getValue('rootConfig', 'App');

// dump config starting from root config
$testConfig = new InifileConfiguration(WCMF_BASE.'app/config/');
$testConfig->addConfiguration($rootConfig);
?>
<body>
  <div class="container">
    <div class="row">
      <div class="span12">
        <section id="what-next">
          <div class="page-header">
            <h1>wCMF config dump</h1>
          </div>
        </section>
        <section id="result">
          <pre>
<?php $logger->info($rootConfig); ?>
<?php $logger->info($testConfig->__toString()); ?>
          </pre>
        </section>
      </div>
    </div>
  </div>
</body>
</html>