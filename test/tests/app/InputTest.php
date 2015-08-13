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

use wcmf\test\lib\SeleniumTestCase;

class InputTest extends SeleniumTestCase {

  public function testCKEditor() {
    $this->setDisplay('large');

    $this->login('admin', 'admin');
    $this->timeouts()->implicitWait(5000);
    // navigate to new chapter
    $this->url(self::getAppUrl().'/data/Chapter/~');
    $editor = $this->waitForXpath('//*[starts-with(@id,"cke_uniqName_")]');
    $this->assertTrue($editor !== false);
    $this->assertRegExp('/New <em>Chapter<\/em>/i', $this->source());
  }
}
?>