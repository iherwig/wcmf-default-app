<?php
define('WCMF_BASE', realpath(dirname(__FILE__).'/../dist').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\core\ClassLoader;
use wcmf\lib\io\FileUtil;
use wcmf\lib\util\TestUtil;
new ClassLoader(WCMF_BASE);
new ClassLoader('../');

setup();
TestUtil::startServer(WCMF_BASE.'app/public', 'router.php');
register_shutdown_function("cleanup");

/**
 * Set up test resources
 */
function setup() {
  @unlink('log.txt');
  @unlink(WCMF_BASE.'app/test-db.sq3');
  FileUtil::emptyDir(WCMF_BASE.'app/cache');
  FileUtil::emptyDir(WCMF_BASE.'app/log');
  FileUtil::emptyDir(WCMF_BASE.'app/searchIndex');
  copy(WCMF_BASE.'../install/tables_sqlite.sql', 'tables_sqlite.sql');
}

/**
 * Clean up test resources
 */
function cleanup() {
  @unlink('tables_sqlite.sql');
}
?>
