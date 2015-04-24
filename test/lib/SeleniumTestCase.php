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
namespace test\lib;

/**
 * SeleniumTestCase is a PHPUnit test case, that
 * serves as base class for test cases used for Selenium.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
abstract class SeleniumTestCase extends \PHPUnit_Extensions_Selenium2TestCase {

  protected static function getAppUrl() {
    return "http://".SERVER_HOST.":".SERVER_PORT;
  }

  /**
   * Log into the application
   * @param $user The username
   * @param $password The password
   */
  protected function login($user, $password) {
    $this->url(self::getAppUrl());
    $this->timeouts()->implicitWait(3000);
    $this->byName('user')->value($user);
    $this->byName('password')->value($password);
    $btn = $this->byXPath("//span[contains(text(),'Sign in')]");
    $btn->click();
  }
}
?>