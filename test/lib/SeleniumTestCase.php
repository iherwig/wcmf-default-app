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
namespace lib;

/**
 * SeleniumTestCase is a PHPUnit test case, that
 * serves as base class for test cases used for Selenium.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
abstract class SeleniumTestCase extends \PHPUnit_Extensions_Selenium2TestCase {

  const APP_URL = 'http://localhost/wcmf-default-app/app/public/';

  protected $captureScreenshotOnFailure = true;
  protected $screenshotPath = __DIR__;
  protected $screenshotUrl = 'http://localhost/wcmf-default-app/test';

  /**
   * Log into the application
   * @param $user The username
   * @param $password The password
   */
  protected function login($user, $password) {
    $this->url(self::APP_URL);
    $this->timeouts()->implicitWait(3000);
    $this->byName('user')->value($user);
    $this->byName('password')->value($password);
    $btn = $this->byXPath("//span[contains(text(),'Sign in')]");
    $btn->click();
  }
}
?>