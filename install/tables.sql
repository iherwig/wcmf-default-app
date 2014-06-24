#
# This file was generated by ChronosGenerator  from model.uml.
# Manual modifications should be placed inside the protected regions.
#
#
# Structure of Table `DBSequence`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `DBSequence`;
CREATE TABLE `DBSequence` # entityType=DBSequence tableId=_s2Ve4LTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_KdSLQPu-EeOpeN9kU-wJYA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Locktable`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Locktable`;
CREATE TABLE `Locktable` # entityType=Locktable tableId=_s73fILTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_KdJBUPu-EeOpeN9kU-wJYA 
  `fk_user_id` INT(11), # columnId=_KdIaQPu-EeOpeN9kU-wJYA referencedTable=User
  `objectid` VARCHAR(255), # columnId=_EVGnsLTTEeOYkOsR5IzpsA 
  `sessionid` VARCHAR(255), # columnId=_EXZGsLTTEeOYkOsR5IzpsA 
  `since` DATETIME, # columnId=_EZrlsLTTEeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
  ,KEY `fk_user_id` (`fk_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Language`
# A language for which a translation of the model can be created. The code is arbitrary but it is recommended to use the ISO language codes (en, de, it, ...).
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Language`;
CREATE TABLE `Language` # entityType=Language tableId=_s5AYYLTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_Kc37kPu-EeOpeN9kU-wJYA 
  `name` VARCHAR(255), # columnId=_mThnQLTOEeOYkOsR5IzpsA 
  `code` VARCHAR(255), # columnId=_mWMgwLTOEeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Translation`
# Instances of this class are used to localize entity attributes. Each instance defines a translation of one attribute of one entity into one language.
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Translation`;
CREATE TABLE `Translation` # entityType=Translation tableId=_tCKUYLTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_KcuKkPu-EeOpeN9kU-wJYA 
  `objectid` VARCHAR(255), # columnId=_4sa_QLTQEeOYkOsR5IzpsA 
  `attribute` VARCHAR(255), # columnId=_4vqggLTQEeOYkOsR5IzpsA 
  `translation` TEXT, # columnId=_4zGPALTQEeOYkOsR5IzpsA 
  `language` VARCHAR(255), # columnId=_42VwQLTQEeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `User`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` # entityType=User tableId=_tJBxYLTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_Kdm7YPu-EeOpeN9kU-wJYA 
  `login` VARCHAR(255), # columnId=_P0GFcLTREeOYkOsR5IzpsA 
  `password` VARCHAR(255), # columnId=_P23FkLTREeOYkOsR5IzpsA 
  `name` VARCHAR(255), # columnId=_P5h_ELTREeOYkOsR5IzpsA 
  `firstname` VARCHAR(255), # columnId=_P8fMcLTREeOYkOsR5IzpsA 
  `config` VARCHAR(255), # columnId=_P_cZ0LTREeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `UserConfig`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `UserConfig`;
CREATE TABLE `UserConfig` # entityType=UserConfig tableId=_tFTvALTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_KckZkPu-EeOpeN9kU-wJYA 
  `fk_user_id` INT(11), # columnId=_KcjygPu-EeOpeN9kU-wJYA referencedTable=User
  `key` VARCHAR(255), # columnId=_1-0UELTREeOYkOsR5IzpsA 
  `val` VARCHAR(255), # columnId=_2AoR8LTREeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
  ,KEY `fk_user_id` (`fk_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Role`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Role`;
CREATE TABLE `Role` # entityType=Role tableId=_s_A5wLTMEeOYkOsR5IzpsA
(
  `id` INT(11) NOT NULL, # columnId=_KdcjUPu-EeOpeN9kU-wJYA 
  `name` VARCHAR(255), # columnId=_blxxgLTWEeOYkOsR5IzpsA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `NMUserRole`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `NMUserRole`;
CREATE TABLE `NMUserRole` # entityType=NMUserRole tableId=_tM8BALTMEeOYkOsR5IzpsA
(
  `fk_role_id` INT(11), # columnId=_KcSFtPu-EeOpeN9kU-wJYA referencedTable=Role
  `fk_user_id` INT(11), # columnId=_KcReoPu-EeOpeN9kU-wJYA referencedTable=User
  PRIMARY KEY (`fk_role_id`,`fk_user_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Publisher`
# A publisher publishes books.
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Publisher`;
CREATE TABLE `Publisher` # entityType=Publisher tableId=_BDrKMLU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_Kb_KwPu-EeOpeN9kU-wJYA 
  `name` VARCHAR(255), # columnId=_UsqjALU2EeORdpT3S9OOtw 
  `created` DATETIME, # columnId=_KbrowPu-EeOpeN9kU-wJYA 
  `creator` VARCHAR(255), # columnId=_Kbv6NPu-EeOpeN9kU-wJYA 
  `modified` DATETIME, # columnId=_KbxvZfu-EeOpeN9kU-wJYA 
  `last_editor` VARCHAR(255), # columnId=_Kb2A1Pu-EeOpeN9kU-wJYA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Author`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Author`;
CREATE TABLE `Author` # entityType=Author tableId=_BGWqwLU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_KbmJMPu-EeOpeN9kU-wJYA 
  `name` VARCHAR(255), # columnId=_rq2WALU2EeORdpT3S9OOtw 
  `created` DATETIME, # columnId=_KbOVwPu-EeOpeN9kU-wJYA 
  `creator` VARCHAR(255), # columnId=_KbT1VPu-EeOpeN9kU-wJYA 
  `modified` DATETIME, # columnId=_KbW4pfu-EeOpeN9kU-wJYA 
  `last_editor` VARCHAR(255), # columnId=_KbcYM_u-EeOpeN9kU-wJYA 
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Book`
# A book is published by a publisher and consists of chapters.
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Book`;
CREATE TABLE `Book` # entityType=Book tableId=_BJe3QLU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_KbIPIPu-EeOpeN9kU-wJYA 
  `fk_publisher_id` INT(11), # columnId=_KbHoEPu-EeOpeN9kU-wJYA referencedTable=Publisher
  `title` VARCHAR(255), # columnId=__mzRoLU3EeORdpT3S9OOtw 
  `description` VARCHAR(255), # columnId=__p_vkLU3EeORdpT3S9OOtw 
  `year` VARCHAR(255), # columnId=__svhkLU3EeORdpT3S9OOtw 
  `created` DATETIME, # columnId=_KakOcPu-EeOpeN9kU-wJYA 
  `creator` VARCHAR(255), # columnId=_Kaq8JPu-EeOpeN9kU-wJYA 
  `modified` DATETIME, # columnId=_Kat_dfu-EeOpeN9kU-wJYA 
  `last_editor` VARCHAR(255), # columnId=_Ka0tJPu-EeOpeN9kU-wJYA 
  PRIMARY KEY (`id`)
  ,KEY `fk_publisher_id` (`fk_publisher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Chapter`
# A book is divided into chapters. A chapter may contain subchapters.
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Chapter`;
CREATE TABLE `Chapter` # entityType=Chapter tableId=_BMnDwLU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_KadgxPu-EeOpeN9kU-wJYA 
  `fk_chapter_id` INT(11), # columnId=_Kac5tPu-EeOpeN9kU-wJYA referencedTable=Chapter
  `fk_book_id` INT(11), # columnId=_KacSovu-EeOpeN9kU-wJYA referencedTable=Book
  `fk_author_id` INT(11), # columnId=_KabrkPu-EeOpeN9kU-wJYA referencedTable=Author
  `name` VARCHAR(255), # columnId=_kq-u8LU4EeORdpT3S9OOtw 
  `created` DATETIME, # columnId=_KZyLUPu-EeOpeN9kU-wJYA 
  `creator` VARCHAR(255), # columnId=_KZ5gFPu-EeOpeN9kU-wJYA 
  `modified` DATETIME, # columnId=_KZ9xhfu-EeOpeN9kU-wJYA 
  `last_editor` VARCHAR(255), # columnId=_KaGUY_u-EeOpeN9kU-wJYA 
  `sortkey_author` INT(11), # columnId=sortkey_author
  `sortkey_book` INT(11), # columnId=sortkey_book
  `sortkey_parentchapter` INT(11), # columnId=sortkey_parentchapter
  `sortkey` INT(11), # columnId=sortkey
  PRIMARY KEY (`id`)
  ,KEY `fk_chapter_id` (`fk_chapter_id`)
  ,KEY `fk_book_id` (`fk_book_id`)
  ,KEY `fk_author_id` (`fk_author_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `Image`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `Image`;
CREATE TABLE `Image` # entityType=Image tableId=_BQLVILU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_KZqPgPu-EeOpeN9kU-wJYA 
  `fk_chapter_id` INT(11), # columnId=_KZpBY_u-EeOpeN9kU-wJYA referencedTable=Chapter
  `fk_titlechapter_id` INT(11), # columnId=_KZoaUPu-EeOpeN9kU-wJYA referencedTable=Chapter
  `file` VARCHAR(255), # columnId=_0UxuULU4EeORdpT3S9OOtw 
  `created` DATETIME, # columnId=_KY9r8Pu-EeOpeN9kU-wJYA 
  `creator` VARCHAR(255), # columnId=_KZIEAfu-EeOpeN9kU-wJYA 
  `modified` DATETIME, # columnId=_KZMVdfu-EeOpeN9kU-wJYA 
  `last_editor` VARCHAR(255), # columnId=_KZU4Ufu-EeOpeN9kU-wJYA 
  `sortkey_titlechapter` INT(11), # columnId=sortkey_titlechapter
  `sortkey_normalchapter` INT(11), # columnId=sortkey_normalchapter
  `sortkey` INT(11), # columnId=sortkey
  PRIMARY KEY (`id`)
  ,KEY `fk_chapter_id` (`fk_chapter_id`)
  ,KEY `fk_titlechapter_id` (`fk_titlechapter_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
#
# Structure of Table `NMPublisherAuthor`
# 
# version 1.0
# init params database
#
DROP TABLE IF EXISTS `NMPublisherAuthor`;
CREATE TABLE `NMPublisherAuthor` # entityType=NMPublisherAuthor tableId=_BTThoLU2EeORdpT3S9OOtw
(
  `id` INT(11) NOT NULL, # columnId=_KYkDVPu-EeOpeN9kU-wJYA 
  `fk_author_id` INT(11), # columnId=_KYjcQPu-EeOpeN9kU-wJYA referencedTable=Author
  `fk_publisher_id` INT(11), # columnId=_KYiOIPu-EeOpeN9kU-wJYA referencedTable=Publisher
  `sortkey_publisher` INT(11), # columnId=sortkey_publisher
  `sortkey_author` INT(11), # columnId=sortkey_author
  `sortkey` INT(11), # columnId=sortkey
  PRIMARY KEY (`id`)
  ,KEY `fk_author_id` (`fk_author_id`)
  ,KEY `fk_publisher_id` (`fk_publisher_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
