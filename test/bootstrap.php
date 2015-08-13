<?php
define('WCMF_BASE', realpath(dirname(__FILE__).'/../dist').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\core\ClassLoader;
use wcmf\lib\io\FileUtil;
use wcmf\lib\util\TestUtil;
new ClassLoader(WCMF_BASE);

setup();
TestUtil::startServer(WCMF_BASE.'app/public', 'router.php');
register_shutdown_function("cleanup");

/**
 * Set up test resources
 */
function setup() {
  @unlink(WCMF_BASE.'app/test-db.sq3');
  $fileUtil = new FileUtil();
  $fileUtil->emptyDir('log');
  $fileUtil->emptyDir(WCMF_BASE.'app/cache');
  $fileUtil->emptyDir(WCMF_BASE.'app/log');
  $fileUtil->emptyDir(WCMF_BASE.'app/searchIndex');
  $fileUtil->mkdirRec(WCMF_BASE.'install');
  copy(WCMF_BASE.'../install/tables_sqlite.sql', WCMF_BASE.'install/tables_sqlite.sql');
}

/**
 * Clean up test resources
 */
function cleanup() {
  @rmdir(WCMF_BASE.'install');
}
?>
