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

class InputTest extends SeleniumTestCase {

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

  public function testCKEditor() {
    $this->setDisplay('large');

    $this->login('admin', 'admin');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::urlContains('home')
    );
    $this->takeScreenShot('InputTest_ckEditor1');
    // navigate to new chapter
    $this->driver->get(self::getAppUrl().'/data/Chapter/~');
    $this->driver->wait()->until(
      WebDriverExpectedCondition::visibilityOfElementLocated(WebDriverBy::className('cke'))
    );
    $this->takeScreenShot('InputTest_ckEditor2');
    $editor = $this->byXpath('//*[starts-with(@id,"cke_uniqName_")]');
    $this->assertTrue($editor !== false);
    $this->assertRegExp('/New <em>Chapter<\/em>/i', $this->driver->getPageSource());
  }
}
?>