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
namespace tests\app;

class LoginTest extends \PHPUnit_Extensions_SeleniumTestCase {

  const APP_URL = 'http://localhost/wcmf-default-app/app/public/';

  protected $captureScreenshotOnFailure = true;
  protected $screenshotPath = __DIR__;
  protected $screenshotUrl = 'http://localhost/wcmf-default-app/test';

  protected function setUp() {
    $this->setBrowser('*firefox');
    $this->setBrowserUrl(self::APP_URL);
  }

  public function testTitle() {
    $this->open(self::APP_URL);
    $this-
    $this->assertTitle('WCMF TEST MODEL');
  }
}
?>