/**
 * Extend the basic Actor
 * @extends {Actor}
 */
export class SimpleActor extends Actor {
    /** @override */
    prepareBaseData() {
      // Data modifications in this step occur before processing embedded
      // documents or derived data.
      game.logger.info("prepareBaseData SimpleActor")
    }
  
    /** @override */
    prepareData() {
      // Prepare data for the actor. Calling the super version of this executes
      // the following, in order: data reset (to clear active effects),
      // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
      // prepareDerivedData().
      super.prepareData();
  
      game.logger.info("prepareData SimpleActor")
    }
  
    prepareDerivedData() {
      game.logger.info("prepareDerivedData SimpleActor")
    }
  };