<?php
/**
 * This file was generated by wCMFGenerator 3.0.0017 from newroles.uml on Thu May 26 15:54:56 CEST 2011.
 * Manual modifications should be placed inside the protected regions.
 */
require_once(WCMF_BASE."wcmf/lib/model/mapper/class.NodeUnifiedRDBMapper.php");
require_once(WCMF_BASE."application/include/model/wcmf/class.Language.php");

/**
 * @class LanguageRDBMapper
 * LanguageRDBMapper maps Language Nodes to the database.
 * Language description: A llanguage for which a translation of the model can be created. The code is arbitrary but it is recommended to use the ISO language codes (en, de, it, ...).
 *
 * @author
 * @version 1.0
 */
class LanguageRDBMapper extends NodeUnifiedRDBMapper
{
  /**
   * @see RDBMapper::getType()
   */
  public function getType()
  {
    return 'Language';
  }
  /**
   * @see PersistenceMapper::getPkNames()
   */
  public function getPkNames()
  {
    return array('id');
  }
  /**
   * @see PersistenceMapper::getProperties()
   */
  public function getProperties()
  {
    return array(
      'is_searchable' => true,
      'display_value' => 'name',
// PROTECTED REGION ID(application/include/model/wcmf/class.LanguageRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }
  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null)
  {
    return array('sortFieldName' => 'name', 'sortDirection' => 'ASC');
  }
  /**
   * @see RDBMapper::getRelationDescriptions()
   */
  protected function getRelationDescriptions()
  {
    return array(
    );
  }
  /**
   * @see RDBMapper::getAttributeDescriptions()
   */
  protected function getAttributeDescriptions()
  {
    return array(
     /**
      * Value description:
      */
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'language', 'id'),
     /**
      * Value description:
      */
      'code' => new RDBAttributeDescription('code', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'language', 'code'),
     /**
      * Value description:
      */
      'name' => new RDBAttributeDescription('name', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'language', 'name'),
    );
  }
  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null)
  {
    return new Language($oid);
  }
  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName()
  {
    return 'language';
  }
}
?>
