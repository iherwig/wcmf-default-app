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
  
  protected $captureScreenshotOnFailure = FALSE;
  protected $screenshotPath = '/home/ingo/public_html/wcmf-default-app/test';
  protected $screenshotUrl = 'http://localhost/~ingo/wcmf-default-app/test';

  protected function setUp() {
    $this->setBrowser('*firefox');
    $this->setBrowserUrl('http://localhost/~ingo/wcmf-default-app/app/public/');
  }

  public function testTitle() {
    $this->open('http://localhost/~ingo/wcmf-default-app/app/public/');
    $this->assertTitle('WCMF TEST MODEL');
  }
}
?>