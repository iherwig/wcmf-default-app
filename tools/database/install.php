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
error_reporting(E_ALL);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use \Exception;
use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\core\ClassLoader;
use wcmf\lib\core\LogManager;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\io\FileUtil;
use wcmf\lib\persistence\BuildDepth;
use wcmf\lib\security\impl\NullPermissionManager;
use wcmf\lib\util\DBUtil;

new ClassLoader(WCMF_BASE);

$logManager = new LogManager(new \wcmf\lib\core\impl\Log4phpLogger('wcmf', 'log4php.php'));
ObjectFactory::registerInstance('logManager', $logManager);
$logger = $logManager->getLogger("install");

$logger->info("initializing wCMF database tables...");

// get configuration from file
$configPath = realpath(WCMF_BASE.'app/config/').'/';
$config = new InifileConfiguration($configPath);
$config->addConfiguration('config.ini');
$config->addConfiguration('../../tools/database/config.ini');
ObjectFactory::configure($config);

// execute custom scripts from the directory 'custom-install'
$installScriptsDir = $config->getDirectoryValue('installScriptsDir', 'installation');
if (is_dir($installScriptsDir)) {
  $sqlScripts = FileUtil::getFiles($installScriptsDir, '/[^_]+_.*\.sql$/', true);
  sort($sqlScripts);
  foreach ($sqlScripts as $script) {
    // extract the initSection from the filename
    $parts = preg_split('/_/', basename($script));
    $initSection = array_shift($parts);
    DBUtil::executeScript($script, $initSection);
  }
}

ObjectFactory::registerInstance('permissionManager', new NullPermissionManager());

$persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
$transaction = $persistenceFacade->getTransaction();
$transaction->begin();
try {
  // initialize database sequence, create default user/role
  if(sizeof($persistenceFacade->getOIDs("DBSequence")) == 0) {
    $logger->info("initializing database sequence...");
    $seq = $persistenceFacade->create("DBSequence", BuildDepth::SINGLE);
    $seq->setValue("id", 1);
  }

  $principalFactory = ObjectFactory::getInstance('principalFactory');
  if ($principalFactory instanceof wcmf\lib\security\principal\impl\DefaultPrincipalFactory) {
    $roleType = $config->getValue('roleType', 'principalFactory');
    $userType = $config->getValue('userType', 'principalFactory');

    $adminRole = $principalFactory->getRole("administrators");
    if (!$adminRole) {
      $logger->info("creating role with name 'administrators'...");
      $adminRole = $persistenceFacade->create($roleType);
      $adminRole->setName("administrators");
    }
    $adminUser = $principalFactory->getUser("admin");
    if (!$adminUser) {
      $logger->info("creating user with login 'admin' password 'admin'...");
      $adminUser = $persistenceFacade->create($userType);
      $adminUser->setLogin("admin");
      $adminUser->setPassword("admin");
      if (in_array("admin.ini", $config->getConfigurations())) {
        $adminUser->setConfig("admin.ini");
      }
    }
    if (!$adminUser->hasRole("administrators")) {
      $logger->info("adding user 'admin' to role 'administrators'...");
      $adminUser->addNode($adminRole);
    }
  }

  $transaction->commit();
  $logger->info("done.");
}
catch (Exception $ex) {
  $logger->error($ex);
  $transaction->rollback();
}
?>