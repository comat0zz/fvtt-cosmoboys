import { SYSTEM } from "./configs/system.mjs";
globalThis.SYSTEM = SYSTEM; // Expose the SYSTEM object to the global scope

import { registerSystemSettings } from "./settings.mjs";
import { initializeHandlebars } from "./handlebars/init.mjs";

// Import modules
import * as CztUtility from "./utilities/_module.mjs";
import * as applications from "./applications/_module.mjs";
import * as documents from "./documents/_module.mjs";
import * as models from "./models/_module.mjs";

import { handleSocketEvent } from "./socket.mjs";

/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
Hooks.once("init", async function() {
  globalThis.cosmoboys = game.cosmoboys = Object.assign(game.system, globalThis.SYSTEM);

  game.logger = new CztUtility.Log(SYSTEM.isDebug);
  
  // Expose the system API
  game.system.api = {
    applications,
    models,
    documents,
  }

  CONFIG.Actor.documentClass = documents.SimpleActor;
  CONFIG.Actor.dataModels = {
    hero: models.Hero
  };

  /*
  Object.assign(CONFIG.Actor.dataModels, {
    "hero" : models.Hero
  }); */

  foundry.documents.collections.Actors.unregisterSheet("core", foundry.appv1.sheets.ActorSheet);
  foundry.documents.collections.Actors.registerSheet(SYSTEM.id, applications.SimpleActorSheet, { 
    types: ["hero"], 
    makeDefault: true,
    label: "TYPES.Actor.Hero"
  });

  // Activate socket handler
  game.socket.on(`system.${SYSTEM.id}`, handleSocketEvent)

  registerSystemSettings();
  initializeHandlebars();

  game.logger.info(`${SYSTEM.id} | System Initialized`);
});

