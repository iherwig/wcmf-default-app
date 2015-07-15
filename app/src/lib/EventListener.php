<?php
namespace app\src\lib;

use wcmf\lib\core\ObjectFactory;
use wcmf\lib\persistence\PersistenceEvent;

/**
 * EventListener
 *
 * @author ingo herwig <ingo@wemove.com>
 */
class EventListener {

  /**
   * Constructor
   */
  public function __construct() {
    // listen to persistence events
    ObjectFactory::getInstance('eventManager')->addListener(PersistenceEvent::NAME,
      array($this, 'persisted'));
    register_shutdown_function(array($this, 'shutdown'));
  }

  /**
   * Shutdown listener
   */
  public function shutdown() {
    ObjectFactory::getInstance('eventManager')->removeListener(PersistenceEvent::NAME,
      array($this, 'persisted'));
  }

  /**
   * Listen to PersistenceEvent
   * @param $event PersistenceEvent instance
   */
  public function persisted(PersistenceEvent $event) {
    $this->invalidateCachedViews();
  }

  /**
   * Invalidate cached views on object change.
   */
  protected function invalidateCachedViews() {
    $view = ObjectFactory::getInstance('view');
    $view->clearCache();
  }
}
?>
