<?php
define('WCMF_BASE', realpath(dirname(__FILE__)).'/');
require_once(dirname(WCMF_BASE)."/vendor/autoload.php");

use wcmf\lib\core\ClassLoader;
use wcmf\lib\io\FileUtil;
new ClassLoader();

// delay any output from phpunit until the script is finished
// in order to awoid conflicts with session headers
ob_start();
?>
