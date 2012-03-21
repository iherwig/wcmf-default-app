<?php
/**
 * wCMF - wemove Content Management Framework
 * Copyright (C) 2005-2009 wemove digital solutions GmbH
 *
 * Licensed under the terms of any of the following licenses
 * at your choice:
 *
 * - GNU Lesser General Public License (LGPL)
 *   http://www.gnu.org/licenses/lgpl.html
 * - Eclipse Public License (EPL)
 *   http://www.eclipse.org/org/documents/epl-v10.php
 *
 * See the license.txt file distributed with this work for
 * additional information.
 *
 * $Id$
 */
namespace wcmf\lib\core;

/**
 * ClassLoader tries to load missing class definitions.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class ClassLoader {

  private static $classMapping = array();

  /**
   * Constructor.
   */
  public function __construct() {
    spl_autoload_register(array($this, 'load'));
  }

  private function load($className) {
    // check if the class is contained in the wcmf namespace
    if (strpos($className, 'wcmf') === 0) {
      $filename = WCMF_BASE.str_replace("\\", "/", $className).'.php';
      if (file_exists($filename)) {
        include($filename);
      }
    }
  }

  /**
  * Search a class definition in any subfolder of WCMF_BASE
  * Code from: http://php.net/manual/en/language.oop5.autoload.php
  *
  * @param className The name of the class
  * @param sub The start directory [optional]
  * @return The directory name
  */
  function searchClass($className, $sub="/") {
    if(file_exists(WCMF_BASE.$sub.getFileName($className))) {
      return WCMF_BASE.$sub;
    }

    $dir = dir(WCMF_BASE.$sub);
    while(false !== ($folder = $dir->read())) {
      if($folder != "." && $folder != "..") {
        if(is_dir(WCMF_BASE.$sub.$folder)) {
          $subFolder = searchClass($className, $sub.$folder."/");
          if($subFolder) {
            return $subFolder;
          }
        }
      }
    }
    $dir->close();
    return false;
  }
}

new ClassLoader();
?>
