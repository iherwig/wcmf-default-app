<?php
define('WCMF_BASE', realpath(dirname(__FILE__).'/..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\core\ClassLoader;
use wcmf\test\lib\TestUtil;
new ClassLoader();

// refresh resources
@unlink('log.txt');
@unlink('test-db.sq3');

TestUtil::startServer(WCMF_BASE.'dist/app/public', 'router.php');
?>
