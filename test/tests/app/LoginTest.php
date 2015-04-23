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

use lib\SeleniumTestCase;

class LoginTest extends SeleniumTestCase {

  protected function setUp() {
    $this->setBrowser('firefox');
    $this->setBrowserUrl(self::APP_URL);
  }

  public function testTitle() {
    $this->url(self::APP_URL);
    $this->assertEquals('WCMF TEST MODEL', $this->title());
  }

  public function testLoginOk() {
    $this->login('admin', 'admin');
    $this->assertEquals('WCMF TEST MODEL - Home', $this->title());
  }

  public function testLoginFailed() {
    $this->login('admin', '');
    $this->assertEquals('WCMF TEST MODEL', $this->title());
    $this->assertRegExp( '/Authentication failed/i', $this->source());
  }
}
?>