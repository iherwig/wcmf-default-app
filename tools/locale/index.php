<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>wCMF - Localization</title>
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
            <h1>wCMF Localization</h1>
          </div>
        </section>
        <section id="result">
          <pre>
<?php
/**
 * This script extracts application messages from calls to Message::get
 */
error_reporting(E_ALL);
define('WCMF_BASE', realpath(dirname(__FILE__).'/../..').'/');
require_once(WCMF_BASE."/vendor/autoload.php");

use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\core\ClassLoader;
use wcmf\lib\core\Log;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\util\I18nUtil;

new ClassLoader(WCMF_BASE);

Log::configure('../log4php.php');

// get configuration from file
$config = new InifileConfiguration('./');
$config->addConfiguration('config.ini');
ObjectFactory::configure($config);

// get config values
$localeDir = $config->getDirectoryValue("localeDir", "application");
$searchDirs = $config->getDirectoryValue("searchDirs", "i18n");
$exclude = $config->getValue("exclude", "i18n");
$languages = $config->getValue("languages", "i18n");
Log::info($searchDirs, "locale");

// get messages from search directories
$allMessages = array();
foreach ($searchDirs as $searchDir) {
  $allMessages = array_merge($allMessages, I18nUtil::getMessages($searchDir, $exclude, "/\.php$|\.js$|\.html$/"));
}

foreach ($languages as $language) {
  // get translations from old file (I18nUtil::createPHPLanguageFile), if existing
  $messageFile = $localeDir."messages_".$language.".php";
  if (file_exists($messageFile)) {
    require($messageFile); // require_once does not work here !!!
  }

  // prepare message array
  $messages = array();
  foreach ($allMessages as $file => $fileMessages) {
    foreach ($fileMessages as $message) {
      if (!isset($messages[$message])) {
        $messages[$message] = array();
        $messages[$message]['translation'] = (isset(${"messages_$language"}[$message])) ? ${"messages_$language"}[$message] : '';
        $messages[$message]['files'] = $file;
      }
      else {
        $messages[$message]['files'] .= ', '.$file;
      }
    }
  }
  $messages = natcaseksort($messages);
  foreach ($messages as $message => $attributes) {
    Log::info($language." ".$message." = ".$attributes['translation']." [".$attributes['files']."]", "locale");
  }

  I18nUtil::createPHPLanguageFile($language, $messages);
}
?>
          </pre>
        </section>
      </div>
    </div>
  </div>
</body>
</html>
<?php
/**
 * Functions
 */
function natcaseksort($array) {
  // Like ksort but uses natural sort instead
  $keys = array_keys($array);
  natcasesort($keys);

  foreach ($keys as $k) {
    $new_array[$k] = $array[$k];
  }
  return $new_array;
}
?>