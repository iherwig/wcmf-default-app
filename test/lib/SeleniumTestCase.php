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

use wcmf\lib\core\ObjectFactory;
use wcmf\test\lib\TestUtil;

/**
 * SeleniumTestCase is a PHPUnit test case, that
 * serves as base class for test cases used for Selenium.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
abstract class SeleniumTestCase extends \PHPUnit_Extensions_Selenium2TestCase {

  private $databaseTester;

  protected static function getAppUrl() {
    return "http://".SERVER_HOST.":".SERVER_PORT;
  }

  protected function setUp() {

    // framework setup
    TestUtil::initFramework(get_class($this), $this->getName());

    // override connection settings in order to use testing db
    // path is relative to WCMF_BASE
    $config = ObjectFactory::getConfigurationInstance();
    $config->addConfiguration('../../test/tests.ini');

    // database setup

    // get connection from first entity type
    $persistenceFacade = ObjectFactory::getInstance('persistenceFacade');
    $types = $persistenceFacade->getKnownTypes();
    $mapper = $persistenceFacade->getMapper($types[0]);
    $pdo = $mapper->getConnection()->getConnection();

    // create sqlite db
    $params = $mapper->getConnectionParams();
    if ($params['dbType'] == 'sqlite') {
      $numTables = $pdo->query('SELECT count(*) FROM sqlite_master WHERE type = "table"')->fetchColumn();
      if ($numTables == 0) {
        $schema = file_get_contents(WCMF_BASE.'install/tables_sqlite.sql');
        $pdo->exec($schema);
      }
    }
    $conn = new \PHPUnit_Extensions_Database_DB_DefaultDatabaseConnection($pdo, $params['dbName']);

    $this->databaseTester = new \PHPUnit_Extensions_Database_DefaultTester($conn);
    $this->databaseTester->setSetUpOperation(\PHPUnit_Extensions_Database_Operation_Factory::CLEAN_INSERT());
      $this->databaseTester->setDataSet($this->getDataSet());
    $this->databaseTester->onSetUp();

    // selenium setup
    $this->setBrowser('firefox');
    $this->setBrowserUrl(self::getAppUrl());
    parent::setUp();
  }

  public function tearDown() {
    if ($this->databaseTester) {
      $dataSet = new \PHPUnit_Extensions_Database_DataSet_YamlDataSet("fixtures/default.yml");
      $this->databaseTester->setTearDownOperation(\PHPUnit_Extensions_Database_Operation_Factory::NONE());
      $this->databaseTester->setDataSet($this->getDataSet());
      $this->databaseTester->onTearDown();
      $this->databaseTester = NULL;
    }
    parent::tearDown();
  }

  /**
   * Get the test data
   * @return \PHPUnit_Extensions_Database_DataSet_YamlDataSet
   */
  protected function getDataSet() {
    return new \PHPUnit_Extensions_Database_DataSet_YamlDataSet("fixtures/default.yml");
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