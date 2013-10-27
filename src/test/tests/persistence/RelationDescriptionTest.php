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
namespace test\tests\persistence;

use wcmf\lib\core\ObjectFactory;
use wcmf\lib\model\mapper\RDBManyToManyRelationDescription;
use wcmf\lib\model\mapper\RDBManyToOneRelationDescription;
use wcmf\lib\model\mapper\RDBOneToManyRelationDescription;

/**
 * RelationDescriptionTest.
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class RelationDescriptionTest extends \PHPUnit_Framework_TestCase {

  public function testMapper() {
    $rel1 = new RDBOneToManyRelationDescription('Chapter', 'ParentChapter', 'Chapter', 'SubChapter',
            '1', '1', '0', 'unbounded', 'composite', 'none', 'true', 'true', 'child', 'id', 'fk_chapter_id');
    $this->assertEquals(ObjectFactory::getInstance('persistenceFacade')->getMapper('Chapter'), $rel1->getThisMapper());
    $this->assertEquals(ObjectFactory::getInstance('persistenceFacade')->getMapper('Chapter'), $rel1->getOtherMapper());
  }

  public function testCompare() {
    // to same type
    $rel11 = new RDBOneToManyRelationDescription('Chapter', 'ParentChapter', 'Chapter', 'SubChapter',
            '1', '1', '0', 'unbounded', 'composite', 'none', 'true', 'true', 'child', 'id', 'fk_chapter_id');
    $rel12 = new RDBManyToOneRelationDescription('Chapter', 'SubChapter', 'Chapter', 'ParentChapter',
            '0', 'unbounded', '1', '1', 'none', 'composite', 'true', 'true', 'parent', 'id', 'fk_chapter_id');
    $this->assertTrue($rel11->isSameRelation($rel12));

    // to other type
    $rel21 = new RDBOneToManyRelationDescription('Chapter', 'TitleChapter', 'Image', 'TitleImage',
            '1', '1', '0', '1', 'composite', 'none', 'true', 'true', 'child', 'id', 'fk_titlechapter_id');
    $rel22 = new RDBManyToOneRelationDescription('Image', 'TitleImage', 'Chapter', 'TitleChapter',
            '0', '1', '1', '1', 'none', 'composite', 'true', 'true', 'parent', 'id', 'fk_titlechapter_id');
    $this->assertTrue($rel21->isSameRelation($rel22));

    // many to many
    $rel31 = new RDBManyToManyRelationDescription(
        /* this -> nm  */ new RDBOneToManyRelationDescription('Publisher', 'Publisher', 'NMPublisherAuthor', 'NMPublisherAuthor',
                '1', '1', '0', 'unbounded', 'shared', 'none', 'true', 'true', 'child', 'id', 'fk_publisher_id'),
        /* nm -> other */ new RDBManyToOneRelationDescription('NMPublisherAuthor', 'NMPublisherAuthor', 'Author', 'Author',
                '0', 'unbounded', '1', '1', 'none', 'shared', 'true', 'true', 'parent', 'id', 'fk_author_id')
        );
    $rel32 = new RDBManyToManyRelationDescription(
        /* this -> nm  */ new RDBOneToManyRelationDescription('Author', 'Author', 'NMPublisherAuthor', 'NMPublisherAuthor',
                '1', '1', '0', 'unbounded', 'shared', 'none', 'true', 'true', 'child', 'id', 'fk_author_id'),
        /* nm -> other */ new RDBManyToOneRelationDescription('NMPublisherAuthor', 'NMPublisherAuthor', 'Publisher', 'Publisher',
                '0', 'unbounded', '1', '1', 'none', 'shared', 'true', 'true', 'parent', 'id', 'fk_publisher_id')
        );
    $this->assertTrue($rel31->isSameRelation($rel32));
  }
}
?>