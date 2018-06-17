<?php
/**
 * wCMF - wemove Content Management Framework
 * Copyright (C) 2005-2016 wemove digital solutions GmbH
 *
 * Licensed under the terms of the MIT License.
 *
 * See the LICENSE file distributed with this work for
 * additional information.
 */
namespace test\tests\app;

use wcmf\test\lib\ArrayDataSet;
use wcmf\test\lib\SeleniumTestCase;

use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverExpectedCondition;

class LoginTest extends SeleniumTestCase {

  protected function getDataSet() {
    return new ArrayDataSet(array(
      'DBSequence' => array(
        array('id' => 1),
      ),
      'User' => array(
        array('id' => 0, 'login' => 'admin', 'name' => 'Administrator', 'password' => '$2y$10$WG2E.dji.UcGzNZF2AlkvOb7158PwZpM2KxwkC6FJdKr4TQC9JXYm', 'active' => 1, 'super_user' => 1, 'config' => ''),
      ),
      'NMUserRole' => array(
        array('fk_user_id' => 0, 'fk_role_id' => 0),
      ),
      'Role' => array(
        array('id' => 0, 'name' => 'administrators'),
      ),
    ));
  }

  public function testTitle() {
    $this->driver->get(self::getAppUrl());
    $this->assertEquals("WCMF TEST MODEL", $this->driver->getTitle());
  }

  public function testLoginOk() {
    $this->setDisplay('large');

    $this->login('admin', 'admin');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::urlContains('home')
    );
    $this->takeScreenShot('LoginTest_loginOk');
    $this->assertEquals(self::getAppUrl().'/home', $this->driver->getCurrentURL());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->driver->getTitle());
  }

  public function testLoginFailed() {
    $this->setDisplay('large');

    $this->login('admin', '');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::visibilityOfElementLocated(WebDriverBy::id('notification'))
    );
    $this->takeScreenShot('LoginTest_loginFailed');
    $this->assertEquals(self::getAppUrl().'/', $this->driver->getCurrentURL());
    $this->assertEquals('WCMF TEST MODEL', $this->driver->getTitle());
    $this->assertRegExp('/Authentication failed/i', $this->driver->getPageSource());
  }

  public function testLogout() {
    $this->setDisplay('xlarge');

    $this->login('admin', 'admin');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::urlContains('home')
    );
    $this->assertEquals(self::getAppUrl().'/home', $this->driver->getCurrentURL());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->driver->getTitle());
    $this->takeScreenShot('LoginTest_logout1');
    // open navigation
    $this->byXPath("//*[@id='navSettings']/a")->click();
    // click logout
    $this->byXPath("//*[@data-wcmf-route='logout']")->click();
    $this->driver->wait()->until(
      WebDriverExpectedCondition::visibilityOfElementLocated(WebDriverBy::name('user'))
    );
    $this->takeScreenShot('LoginTest_logout2');
    $this->assertEquals(self::getAppUrl().'/', $this->driver->getCurrentURL());
    $this->assertEquals('WCMF TEST MODEL', $this->driver->getTitle());
  }

  public function testLogoutSmall() {
    $this->setDisplay('small');

    $this->login('admin', 'admin');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::urlContains('home')
    );
    $this->assertEquals(self::getAppUrl().'/home', $this->driver->getCurrentURL());
    $this->assertNotNull($this->byXPath("//*[@class='home-page']"));
    $this->assertEquals('WCMF TEST MODEL - Home', $this->driver->getTitle());
    $this->takeScreenShot('LoginTest_logoutSmall1');
    // open navigation
    $this->byXPath("//nav/div/div[1]/button")->click();
    $this->byXPath("//*[@id='navSettings']/a")->click();
    // click logout
    $btn = $this->byXPath("//*[@data-wcmf-route='logout']")->click();
    $this->driver->wait()->until(
      WebDriverExpectedCondition::visibilityOfElementLocated(WebDriverBy::name('user'))
    );
    $this->takeScreenShot('LoginTest_logoutSmall2');
    $this->assertEquals(self::getAppUrl().'/', $this->driver->getCurrentURL());
    $this->assertEquals('WCMF TEST MODEL', $this->driver->getTitle());
  }
}
?>