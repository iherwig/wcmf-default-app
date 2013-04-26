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
 * This file was generated by ChronosGenerator  from cwm-export.uml on Fri Apr 26 13:28:18 CEST 2013. 
 * Manual modifications should be placed inside the protected regions.
 */
namespace testapp\application\model\wcmf;

use wcmf\lib\model\Node;

use wcmf\lib\i18n\Message;
use wcmf\lib\persistence\ObjectId;

/**
 * @class Translation
 * Translation description: Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.
 *
 * @author 
 * @version 1.0
 */
class TranslationBase extends Node {

    /**
     * Constructor
     * @param oid ObjectId instance (optional)
     */
    public function __construct($oid=null) {
      if ($oid == null) {
        $oid = new ObjectId('Translation');
    }
      parent::__construct($oid);
    }

    /**
     * @see PersistentObject::getObjectDisplayName()
     */
    public function getObjectDisplayName() {
      return Message::get("Translation");
    }

    /**
     * @see PersistentObject::getObjectDescription()
     */
    public function getObjectDescription() {
      return Message::get("Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.");
    }

    /**
     * @see PersistentObject::getValueDisplayName()
     */
    public function getValueDisplayName($name) {
      $displayName = $name;
      if ($name == 'id') { $displayName = Message::get("id"); }
      if ($name == 'objectid') { $displayName = Message::get("objectid"); }
      if ($name == 'attribute') { $displayName = Message::get("attribute"); }
      if ($name == 'translation') { $displayName = Message::get("translation"); }
      if ($name == 'language') { $displayName = Message::get("language"); }
      return Message::get($displayName);
    }

    /**
     * @see PersistentObject::getValueDescription()
     */
    public function getValueDescription($name) {
      $description = $name;
      if ($name == 'id') { $description = Message::get(""); }
      if ($name == 'objectid') { $description = Message::get("The object id of the object to which the translation belongs"); }
      if ($name == 'attribute') { $description = Message::get("The attribute of the object that is translated"); }
      if ($name == 'translation') { $description = Message::get("The translation"); }
      if ($name == 'language') { $description = Message::get("The language of the translation"); }
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
     * Get the value of the objectid attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getObjectid($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('objectid'); }
      else { $value = $this->getValue('objectid'); }
      return $value;
    }

    /**
     * Set the value of the objectid attribute
     * @param objectid The value to set
     */
    public function setObjectid($objectid) {
      return $this->setValue('objectid', $objectid);
    }
    /**
     * Get the value of the attribute attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getAttribute($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('attribute'); }
      else { $value = $this->getValue('attribute'); }
      return $value;
    }

    /**
     * Set the value of the attribute attribute
     * @param attribute The value to set
     */
    public function setAttribute($attribute) {
      return $this->setValue('attribute', $attribute);
    }
    /**
     * Get the value of the translation attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getTranslation($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('translation'); }
      else { $value = $this->getValue('translation'); }
      return $value;
    }

    /**
     * Set the value of the translation attribute
     * @param translation The value to set
     */
    public function setTranslation($translation) {
      return $this->setValue('translation', $translation);
    }
    /**
     * Get the value of the language attribute
     * @param unconverted Boolean wether to get the converted or stored value (default: false)
     * @return Mixed
     */
    public function getLanguage($unconverted=false) {
      $value = null;
      if ($unconverted) { $value = $this->getUnconvertedValue('language'); }
      else { $value = $this->getValue('language'); }
      return $value;
    }

    /**
     * Set the value of the language attribute
     * @param language The value to set
     */
    public function setLanguage($language) {
      return $this->setValue('language', $language);
    }
     
}
?>
