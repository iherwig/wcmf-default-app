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
namespace wcmf\lib\presentation\control\lists\impl;

use wcmf\lib\config\ConfigurationException;
use wcmf\lib\presentation\control\lists\ListStrategy;

/**
 * FunctionListStrategy implements list of key value pairs that is retrieved
 * by a global function.
 * The following list definition(s) must be used in the input_type configuraton:
 * @code
 * func:name|param1,param2,... // where name is the name of a global function and
 *                               param1, param2, ... are used as parameters in the call
 *                               to that function
 * @endcode
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class FunctionListStrategy implements ListStrategy {

  /**
   * @see ListStrategy::getList
   */
  public function getList($configuration, $language=null) {
    // maybe there are '|' chars in parameters
    $parts = explode('|', $configuration);
    $name = array_shift($parts);
    $params = join('|', $parts);
    if (function_exists($name)) {
      $map = call_user_func_array($name, explode(',', $params));
    }
    else {
      throw new ConfigurationException('Function '.$name.' is not defined globally!');
    }
    return $map;
  }

  /**
   * @see ListStrategy::isStatic
   */
  public function isStatic($configuration) {
    return false;
  }
}
?>
