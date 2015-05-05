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
    $this->setDisplay('large');

    $this->url(self::getAppUrl());
    $this->assertEquals('WCMF TEST MODEL', $this->title());
  }

  public function testLoginOk() {
    $this->setDisplay('large');

    $this->login('admin', 'admin');
    $this->assertEquals(self::getAppUrl().'/home', $this->url());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->title());
  }

  public function testLoginFailed() {
    $this->setDisplay('large');

    $this->login('admin', '');
    $this->assertEquals(self::getAppUrl().'/', $this->url());
    $this->assertEquals('WCMF TEST MODEL', $this->title());
    $this->assertRegExp( '/Authentication failed/i', $this->source());
  }

  public function testLogout() {
    $this->setDisplay('large');

    $this->login('admin', 'admin');
    $this->assertEquals(self::getAppUrl().'/home', $this->url());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->title());
    // open navigation
    $this->byXPath("//*[@id='navSettings']/a")->click();
    // clock logout
    $btn = $this->byXPath("//*[@data-wcmf-route='logout']");
    $btn->click();
    $this->assertEquals(self::getAppUrl().'/', $this->url());
    $this->assertEquals('WCMF TEST MODEL', $this->title());
  }

  public function testLogoutSmall() {
    $this->setDisplay('small');

    $this->login('admin', 'admin');
    $this->assertEquals(self::getAppUrl().'/home', $this->url());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->title());
    // open navigation
    $this->byXPath("//nav/div/div[1]/button")->click();
    $this->byXPath("//*[@id='navSettings']/a")->click();
    // clock logout
    $btn = $this->byXPath("//*[@data-wcmf-route='logout']");
    $btn->click();
    $this->assertEquals(self::getAppUrl().'/', $this->url());
    $this->assertEquals('WCMF TEST MODEL', $this->title());
  }
}
?>