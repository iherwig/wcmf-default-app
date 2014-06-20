<?php
/**
 * This script extracts application messages from calls to Message::get
 */
error_reporting(E_ERROR | E_PARSE);
define("WCMF_BASE", realpath ("../../../")."/");

require_once(WCMF_BASE."wcmf/lib/core/ClassLoader.php");

use wcmf\lib\core\Log;
use wcmf\lib\core\ObjectFactory;
use wcmf\lib\config\impl\InifileConfiguration;
use wcmf\lib\util\I18nUtil;

// read config file
$config = new InifileConfiguration('./');
$config->addConfiguration('config.ini');
ObjectFactory::configure($config);
Log::configure('../log4php.php');

// get config values
$localeDir = getConfigValue("localeDir", "application", true);
$searchDirs = getConfigValue("searchDirs", "i18n", true);
$exclude = getConfigValue("exclude", "i18n");
$languages = getConfigValue("languages", "i18n");
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
        $messages[$message]['translation'] = ${"messages_$language"}[$message];
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
exit;

function natcaseksort($array) {
  // Like ksort but uses natural sort instead
  $keys = array_keys($array);
  natcasesort($keys);

  foreach ($keys as $k) {
    $new_array[$k] = $array[$k];
  }
  return $new_array;
}

function getConfigValue($key, $section, $isDirectory=false) {
  $config = ObjectFactory::getConfigurationInstance();
  if ($isDirectory) {
    $value = $config->getDirectoryValue($key, $section);
  }
  else {
    $value = $config->getValue($key, $section);
  }
  return $value;
}
?>