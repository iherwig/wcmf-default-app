<?php
/**
 * wCMF - wemove Content Management Framework
 * Copyright (C) 2005-2009 wemove digital solutions GmbH
 *
 * Licensed under the terms of any of the following licenses
 * at your choice:
 *
 * - GNU Lesser General Public License (LGPL)
 *   http://www.gnu.org/licenses/lgpl.html
 * - Eclipse Public License (EPL)
 *   http://www.eclipse.org/org/documents/epl-v10.php
 *
 * See the license.txt file distributed with this work for
 * additional information.
 *
 * $Id$
 */
require_once(WCMF_BASE.'wcmf/lib/util/class.InifileParser.php');

$includePath = get_include_path();
if (strpos($includePath, 'Zend') === false) {
  set_include_path(get_include_path().PATH_SEPARATOR.WCMF_BASE.'wcmf/3rdparty/zend');
}
require_once('Zend/Search/Lucene.php');

/**
 * @class SearchUtil
 * @ingroup Util
 * @brief This class provides access to the search based on Zend_Search_Lucene.
 * The search index stored in the location that is defined by the configuration key 'indexPath'
 * in the configuration section 'search'. To manage PersistentObjects in the index use the
 * methods SearchUtil::indexInSearch() and SearchIndex::deleteFromSearch() and SearchUtil::commitIndex().
 * The method SearchUtil::getIndex() offers direct access to the search index for advanced operations.
 *
 * @author Niko <enikao@users.sourceforge.net>
 */
class SearchUtil
{
  const INI_SECTION = 'search';
  const INI_INDEX_PATH = 'indexPath';

  private static $index;
  private static $indexPath;
  private static $indexIsDirty = false;

  /**
   * Get the search index.
   * @param create True/False wether to create the index, if it does not exist [default: true]
   * @return An instance of Zend_Search_Lucene_Interface
   */
  public static function getIndex($create = true)
  {
    if (!self::$index && $create)
    {
      $indexPath = self::getIndexPath();

      Zend_Search_Lucene_Analysis_Analyzer::setDefault(new Zend_Search_Lucene_Analysis_Analyzer_Common_Utf8Num_CaseInsensitive());
      if (defined(Zend_Search_Lucene_Search_Query_Wildcard)) {
        Zend_Search_Lucene_Search_Query_Wildcard::setMinPrefixLength(0);
      }
      Zend_Search_Lucene_Search_QueryParser::setDefaultOperator(Zend_Search_Lucene_Search_QueryParser::B_AND);

      try {
        self::$index = Zend_Search_Lucene::open($indexPath);
      }
      catch (Zend_Search_Lucene_Exception $ex) {
        self::$index = self::resetIndex();
      }
    }
    return self::$index;
  }

  /**
   * Reset the search index.
   */
  public static function resetIndex()
  {
    $indexPath = self::getIndexPath();

    return Zend_Search_Lucene::create($indexPath);
  }

  /**
   * Add a PersistentObject instance to the search index. This method modifies the
   * index. For that reason SearchUtil::commitIndex() should be called afterwards.
   * @param obj The PersistentObject instance.
   */
  public static function indexInSearch(&$obj)
  {
    if ($obj->isIndexInSearch())
    {
      $index = self::getIndex();
      $encoding = new EncodingUtil();

      $doc = new Zend_Search_Lucene_Document();

      $valueNames = $obj->getValueNames();

      $doc->addField(Zend_Search_Lucene_Field::unIndexed('oid', $obj->getOID(), 'utf-8'));
      $typeField = Zend_Search_Lucene_Field::keyword('type', $obj->getType(), 'utf-8');
      $typeField->isStored = false;
      $doc->addField($typeField);

      foreach ($valueNames as $currValueName)
      {
        $properties = $obj->getValueProperties($currValueName);

        $value = $obj->getValue($currValueName);

        switch($properties['input_type'])
        {
          case 'text':
            $doc->addField(Zend_Search_Lucene_Field::unStored($currValueName, $encoding->convertIsoToCp1252Utf8($value), 'utf-8'));
            break;

          case 'fckeditor':
            $doc->addField(Zend_Search_Lucene_Field::unStored($currValueName,
              html_entity_decode($encoding->convertIsoToCp1252Utf8(strip_tags($value)), ENT_QUOTES,'utf-8'), 'utf-8'));
            break;

          default:
            $field = Zend_Search_Lucene_Field::keyword($currValueName, $value, 'utf-8');
            $field->isStored = false;
            $doc->addField($field);
        }
      }

      $term = new Zend_Search_Lucene_Index_Term($obj->getOID(), 'oid');
      $docIds  = $index->termDocs($term);
      foreach ($docIds as $id)
      {
        $index->delete($id);
      }

      $index->addDocument($doc);
      self::$indexIsDirty = true;
    }
  }

  /**
   * Delete a PersistentObject instance from the search index.
   * @param obj The PersistentObject instance.
   */
  public static function deleteFromSearch(&$obj)
  {
    if ($obj->isIndexInSearch())
    {
      $index = self::getIndex();

      $term = new Zend_Search_Lucene_Index_Term($obj->getOID(), 'oid');
      $docIds  = $index->termDocs($term);
      foreach ($docIds as $id)
      {
        $index->delete($id);
      }
      self::$indexIsDirty = true;
    }
  }

  /**
   * Commit any changes made by using SearchUtil::indexInSearch() and SearchIndex::deleteFromSearch().
   * @note By default this method only commits the index if changes were made using the methods mentioned above.
   * If you want to make sure that the index is committed in any case, set forceCommit to true.
   * @param forceCommit True/False wether the index should be committed even if no changes were made
   *   using the methods mentioned above [default: false].
   */
  public static function commitIndex($forceCommit = false)
  {
    if (self::$indexIsDirty || $forceCommit)
    {
      $index = self::getIndex(false);
      if ($index) {
        $index->commit();
      }
    }
  }

  /**
   * Get the path to the index.
   * @return The path.
   */
  private static function getIndexPath()
  {
    if (!self::$indexPath)
    {
      $parser = InifileParser::getInstance();
      if (($path = $parser->getValue(self::INI_INDEX_PATH, self::INI_SECTION)) !== false)
      {
        self::$indexPath = WCMF_BASE . 'application/' . $path;

        if (!file_exists(self::$indexPath)) {
          FileUtil::mkdirRec(self::$indexPath);
        }

        if (!is_writeable(self::$indexPath)) {
          Log::error("Index path '".self::$indexPath."' is not writeable.", __CLASS__);
        }

        Log::debug("Lucene index location: ".self::$indexPath, __CLASS__);
      }
      else
      {
        Log::error($parser->getErrorMsg(), __CLASS__);
      }
    }
    return self::$indexPath;
  }
}
