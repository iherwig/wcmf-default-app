<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>wCMF - graph</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link href="../../app/public/vendor/twitter-bootstrap/css/bootstrap.css" rel="stylesheet">
  <link href="../../app/public/css/app.css" rel="stylesheet">
</head>
<body>
  <div class="container">
    <div class="row">
      <div class="span12">
        <section id="what-next">
          <div class="page-header">
            <h1>wCMF graph</h1>
          </div>
        </section>
        <section id="result">
          <pre>
<?php
/**
 * This script demonstrates how to output an object tree to a dot file
 */
error_reporting(E_ALL);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\core\ClassLoader;
use wcmf\lib\core\Log;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\model\output\DotOutputStrategy;
use wcmf\lib\model\visitor\OutputVisitor;

new ClassLoader();

Log::configure('../log4php.php');

// get configuration from file
$configPath = realpath(WCMF_BASE.'app/config/').'/';
$config = new InifileConfiguration($configPath);
$config->addConfiguration('config.ini');
$config->addConfiguration('../../tools/graph/config.ini');
ObjectFactory::configure($config);

// get root oids
$oids = array();
$rootTypes = $config->getValue('rootTypes', 'application');
if (is_array($rootTypes)) {
  $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
  foreach($rootTypes as $rootType) {
    Log::info("Getting oids for: ".$rootType, "graph");
    $oidsTmp = $persistenceFacade->getOIDs($rootType);
    Log::info("Found: ".sizeof($oidsTmp), "graph");
    $oids = array_merge($oids, $oidsTmp);
  }
}

// construct tree from root oids
$persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
$nodes = array();
foreach($oids as $oid) {
  $nodes[] = $persistenceFacade->load($oid);
}

// output tree to dot
$filename = "graph.dot";
$os = new DotOutputStrategy($filename);
$ov = new OutputVisitor($os);
$ov->startArray($nodes);
Log::info("Created file: <a href='".$filename."'>".$filename."</a>", "graph");
Log::info("Use dot to create image: dot -Tpng ".$filename." > graph.png", "graph");
?>
          </pre>
        </section>
      </div>
    </div>
  </div>
</body>
</html>