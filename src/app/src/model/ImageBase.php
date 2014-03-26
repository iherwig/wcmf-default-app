<?php
/*
 * Copyright (c) 2013 The Olympos Development Team.
 * 
 * http://sourceforge.net/projects/olympos/
 * 
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html. If redistributing this code,
 * this entire header must remain intact.
 */

/**
 * This file was generated by ChronosGenerator  from model.uml.
 * Manual modifications should be placed inside the protected regions.
 */
namespace app\src\model;

use app\src\model\EntityBase;

use wcmf\lib\i18n\Message;
use wcmf\lib\persistence\ObjectId;

/**
 * @class Image
 * Image description: 
 *
 * @author 
 * @version 1.0
 */
class ImageBase extends EntityBase {

    /**
     * Constructor
     * @param oid ObjectId instance (optional)
     */
    public function __construct($oid=null) {
      if ($oid == null) {
        $oid = new ObjectId('Image');
    }
      parent::__construct($oid);
    }

    /**
     * @see PersistentObject::getObjectDisplayName()
     */
    public function getObjectDisplayName() {
      return Message::get("Image");
    }

    /**
     * @see PersistentObject::getObjectDescription()
     */
    public function getObjectDescription() {
      return Message::get("");
    }

    /**
     * @see PersistentObject::getValueDisplayName()
     */
    public function getValueDisplayName($name) {
      $displayName = $name;
      if ($name == 'id') { $displayName = Message::get("id"); }
      if ($name == 'fk_chapter_id') { $displayName = Message::get("fk_chapter_id"); }
      if ($name == 'fk_titlechapter_id') { $displayName = Message::get("fk_titlechapter_id"); }
      if ($name == 'filename') { $displayName = Message::get("filename"); }
      if ($name == 'created') { $displayName = Message::get("created"); }
      if ($name == 'creator') { $displayName = Message::get("creator"); }
      if ($name == 'modified') { $displayName = Message::get("modified"); }
      if ($name == 'last_editor') { $displayName = Message::get("last_editor"); }
      return Message::get($displayName);
    }

    /**
     * @see PersistentObject::getValueDescription()
     */
    public function getValueDescription($name) {
      $description = $name;
      if ($name == 'id') { $description = Message::get(""); }
      if ($name == 'fk_chapter_id') { $description = Message::get(""); }
      if ($name == 'fk_titlechapter_id') { $description = Message::get(""); }
      if ($name == 'filename') { $description = Message::get(""); }
      if ($name == 'created') { $description = Message::get(""); }
      if ($name == 'creator') { $description = Message::get(""); }
      if ($name == 'modified') { $description = Message::get(""); }
      if ($name == 'last_editor') { $description = Message::get(""); }
      return Message::get($description);
    }

    /**
     * Get the value of the id attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getId($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('id'); }
      else { $value = $this->getValue('id'); }
      return $value;
    }

    /**
     * Set the value of the id attribute
     * @param id The value to set
     */
    public function setId($id) {
      return $this->setValue('id', $id);
    }
    /**
     * Get the value of the fk_chapter_id attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getFkChapterId($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('fk_chapter_id'); }
      else { $value = $this->getValue('fk_chapter_id'); }
      return $value;
    }

    /**
     * Set the value of the fk_chapter_id attribute
     * @param fk_chapter_id The value to set
     */
    public function setFkChapterId($fk_chapter_id) {
      return $this->setValue('fk_chapter_id', $fk_chapter_id);
    }
    /**
     * Get the value of the fk_titlechapter_id attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getFkTitlechapterId($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('fk_titlechapter_id'); }
      else { $value = $this->getValue('fk_titlechapter_id'); }
      return $value;
    }

    /**
     * Set the value of the fk_titlechapter_id attribute
     * @param fk_titlechapter_id The value to set
     */
    public function setFkTitlechapterId($fk_titlechapter_id) {
      return $this->setValue('fk_titlechapter_id', $fk_titlechapter_id);
    }
    /**
     * Get the value of the filename attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getFilename($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('filename'); }
      else { $value = $this->getValue('filename'); }
      return $value;
    }

    /**
     * Set the value of the filename attribute
     * @param filename The value to set
     */
    public function setFilename($filename) {
      return $this->setValue('filename', $filename);
    }
    /**
     * Get the sortkey for the TitleChapter relation
     * @return Number
     */
    public function getSortkeyTitlechapter() {
      return $this->getValue('sortkey_titlechapter');
    }

    /**
     * Set the sortkey for the TitleChapter relation
     * @param sortkey The sortkey value
     */
    public function setSortkeyTitlechapter($sortkey) {
      return $this->setValue('sortkey_titlechapter', $sortkey);
    }
    /**
     * Get the sortkey for the NormalChapter relation
     * @return Number
     */
    public function getSortkeyNormalchapter() {
      return $this->getValue('sortkey_normalchapter');
    }

    /**
     * Set the sortkey for the NormalChapter relation
     * @param sortkey The sortkey value
     */
    public function setSortkeyNormalchapter($sortkey) {
      return $this->setValue('sortkey_normalchapter', $sortkey);
    }

    /**
     * Get the default sortkey
     * @return Number
     */
    public function getSortkey() {
      return $this->getValue('sortkey');
    }

    /**
     * Set the default sortkey
     * @param sortkey The sortkey value
     */
    public function setSortkey($sortkey) {
      return $this->setValue('sortkey', $sortkey);
    }
     
    /**
     * Get the Chapter instances in the TitleChapter relation
     * @return Array of Chapter instances
     */
    public function getTitleChapterList() {
      return $this->getParentsEx(null, 'TitleChapter');
        }

    /**
     * Set the Chapter instances in the TitleChapter relation
     * @param nodeList Array of Chapter instances
     */
    public function setTitleChapterList(array $nodeList) {
      $this->setValue('TitleChapter', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'TitleChapter');
      }
      }
    /**
     * Get the Chapter instances in the NormalChapter relation
     * @return Array of Chapter instances
     */
    public function getNormalChapterList() {
      return $this->getParentsEx(null, 'NormalChapter');
        }

    /**
     * Set the Chapter instances in the NormalChapter relation
     * @param nodeList Array of Chapter instances
     */
    public function setNormalChapterList(array $nodeList) {
      $this->setValue('NormalChapter', null);
      foreach ($nodeList as $node) {
        $this->addNode($node, 'NormalChapter');
      }
      }
}
?>
