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
namespace test\tests\app;

use test\lib\SeleniumTestCase;

class LoginTest extends SeleniumTestCase {

  public function testTitle() {
    $this->url(self::getAppUrl());
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

  public function testLogout() {
    $this->login('admin', 'admin');
    $this->assertEquals('WCMF TEST MODEL - Home', $this->title());
    // open navigation
    $this->byXPath("//nav/div/div[1]/button")->click();
    $this->byXPath("//*[@id='navSettings']/a")->click();
    // clock logout
    $btn = $this->byXPath("//*[@data-wcmf-route='logout']");
    $btn->click();
    $this->assertEquals('WCMF TEST MODEL', $this->title());
  }
}
?>