<?php
/**
 * This file was generated by wCMFGenerator 3.0.0017 from newroles.uml on Fri Jun 10 17:44:16 CEST 2011.
 * Manual modifications should be placed inside the protected regions.
 */
namespace application\model\wcmf;

use application\model\wcmf\Translation;
use wcmf\lib\model\mapper\NodeUnifiedRDBMapper;
use wcmf\lib\model\mapper\RDBAttributeDescription;
use wcmf\lib\model\mapper\RDBMapper;
use wcmf\lib\persistence\ObjectId;

/**
 * @class TranslationRDBMapper
 * TranslationRDBMapper maps Translation Nodes to the database.
 * Translation description: Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.
 *
 * @author
 * @version 1.0
 */
class TranslationRDBMapper extends NodeUnifiedRDBMapper
{
  /**
   * @see RDBMapper::getType()
   */
  public function getType()
  {
    return 'Translation';
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
      'display_value' => 'objectid|attribute|language',
// PROTECTED REGION ID(application/include/model/wcmf/TranslationRDBMapper.php/Properties) ENABLED START
// PROTECTED REGION END
    );
  }
  /**
   * @see RDBMapper::getOwnDefaultOrder()
   */
  public function getOwnDefaultOrder($roleName=null)
  {
    return null;
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
      'id' => new RDBAttributeDescription('id', '', array('DATATYPE_IGNORE'), null, '', '', '', false, 'text', 'text', 'translation', 'id'),
     /**
      * Value description: The object id of the object to which the translation belongs
      */
      'objectid' => new RDBAttributeDescription('objectid', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'translation', 'objectid'),
     /**
      * Value description: The attribute of the object that is translated
      */
      'attribute' => new RDBAttributeDescription('attribute', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'translation', 'attribute'),
     /**
      * Value description: The translation
      */
      'translation' => new RDBAttributeDescription('translation', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'translation', 'translation'),
     /**
      * Value description: The language of the translation
      */
      'language' => new RDBAttributeDescription('language', 'string', array('DATATYPE_ATTRIBUTE'), null, '', '', '', true, 'text', 'text', 'translation', 'language'),
    );
  }
  /**
   * @see RDBMapper::createObject()
   */
  protected function createObject(ObjectId $oid=null)
  {
    return new Translation($oid);
  }
  /**
   * @see NodeUnifiedRDBMapper::getTableName()
   */
  protected function getTableName()
  {
    return 'translation';
  }
}
?>
