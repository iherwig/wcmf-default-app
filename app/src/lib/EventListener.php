<?php
namespace app\src\lib;

use wcmf\lib\core\EventManager;
use wcmf\lib\io\Cache;
use wcmf\lib\io\ImageUtil;
use wcmf\lib\persistence\PersistenceEvent;
use wcmf\lib\presentation\view\View;

/**
 * EventListener
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class EventListener {

  private $_eventManager = null;
  private $_view = null;
  private $_dynamicCache = null;
  private $_frontendCache = null;

  /**
   * Constructor
   * @param $eventManager
   * @param $view
   * @param $dynamicCache
   * @param $frontendCache
   */
  public function __construct(EventManager $eventManager,
          View $view, Cache $dynamicCache, Cache $frontendCache) {
    $this->_eventManager = $eventManager;
    $this->_view = $view;
    $this->_dynamicCache = $dynamicCache;
    $this->_frontendCache = $frontendCache;
    $this->_eventManager->addListener(PersistenceEvent::NAME, [$this, 'persisted']);
  }

  /**
   * Destructor
   */
  public function __destruct() {
    $this->_eventManager->removeListener(PersistenceEvent::NAME, [$this, 'persisted']);
  }

  /**
   * Listen to PersistenceEvent
   * @param $event PersistenceEvent instance
   */
  public function persisted(PersistenceEvent $event) {
    // invalidate all cached views
    $this->invalidateCachedViews();

    // invalidate all other cached responses (e.g. json)
    $this->invalidateDynamicCache();

    // invalidate cached images from changed attributes
    $object = $event->getObject();
    if ($object) {
      foreach ($object->getChangedValues() as $value) {
        if ($object->getValueProperty($value, 'display_type') == 'image') {
          ImageUtil::invalidateCache($object->getValue($value));
          ImageUtil::invalidateCache($object->getOriginalValue($value));
        }
      }
    }
  }

  /**
   * Invalidate cached views on object change.
   */
  protected function invalidateCachedViews() {
    $this->_view->clearCache();
  }

  /**
   * Invalidate the dynamic cache.
   */
  protected function invalidateDynamicCache() {
    $this->_dynamicCache->clearAll();
  }

  /**
   * Invalidate the frontend cache.
   */
  protected function invalidateFrontendCache() {
    $this->_frontendCache->clearAll();
  }
}
?>
